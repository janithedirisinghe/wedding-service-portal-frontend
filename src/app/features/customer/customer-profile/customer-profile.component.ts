import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services';
import { CustomerDetails, CustomerStats } from '../models';
import { AuthService } from '../../../shared/services/auth.service';
import { ChangePasswordRequest } from '../../../shared/Models/change-password.model';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  profile: CustomerDetails | null = null;
  loading: boolean = false;
  error: string | null = null;
  isEditModalOpen: boolean = false;
  isChangePasswordModalOpen: boolean = false;
  
  // Customer stats
  stats: CustomerStats | null = null;
  statsLoading: boolean = false;
  
  // Change password form data
  changePasswordData: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  changePasswordLoading: boolean = false;
  changePasswordError: string | null = null;
  changePasswordSuccess: string | null = null;

  constructor(private customerService: CustomerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadCustomerProfile();
  }

  /**
   * Load customer profile data from API
   */
  loadCustomerProfile(): void {
    this.loading = true;
    this.error = null;
     const customerId = this.authService.getUserId();
    if (!customerId) {
      console.error('Vendor ID not found');
      return;
    }
    // For now, using getCurrentCustomerProfile() to get the authenticated user's profile
    // You can also use getCustomerDetails(customerId) if you have a specific customer ID
    this.customerService.getCustomerDetails(customerId).subscribe({
      next: (profile: CustomerDetails) => {
        this.profile = profile;
        this.loading = false;
        console.log('Customer profile loaded:', this.profile);
        // Load stats after profile is loaded
        this.loadCustomerStats(customerId);
      },
      error: (error) => {
        console.error('Error loading customer profile:', error);
        this.error = 'Failed to load customer profile. Please try again.';
        this.loading = false;
        // Fallback to dummy data for development
        this.loadDummyData();
      }
    });
  }

  /**
   * Load customer stats from API
   */
  loadCustomerStats(userId: number): void {
    this.statsLoading = true;
    this.customerService.getCustomerStats(userId).subscribe({
      next: (stats: CustomerStats) => {
        this.stats = stats;
        this.statsLoading = false;
        console.log('Customer stats loaded:', this.stats);
      },
      error: (error) => {
        console.error('Error loading customer stats:', error);
        this.statsLoading = false;
        // Fallback to default stats
        this.stats = {
          bookingsCount: 0,
          reviewsCount: 0,
          favoritesCount: 0
        };
      }
    });
  }

  /**
   * Load dummy data as fallback or for development
   */
  loadDummyData(): void {
    this.profile = {
      customerId: 1,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1 (234) 567-890',
      userEmail: 'john.doe@example.com',
      bio: 'Passionate about creating memorable wedding experiences. I enjoy working with talented vendors to bring dream weddings to life.',
      address: '123 Main Street',
      city: 'New York',
      country: 'USA',
      location: 'New York, NY',
      weddingDate: new Date('2025-08-15'),
      budget: '$10,000 - $15,000',
      preferredVendorTypes: ['Photography', 'Catering', 'Venue', 'Decoration'],
      userName: 'johndoe'
    };
  }

  /**
   * Open the edit profile modal
   */
  openEditModal(): void {
    this.isEditModalOpen = true;
  }

  /**
   * Close the edit profile modal
   */
  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  /**
   * Handle profile update from modal
   */
  onProfileUpdated(updatedProfile: CustomerDetails): void {
    this.profile = updatedProfile;
    this.closeEditModal();
  }

  /**
   * Open the change password modal
   */
  openChangePasswordModal(): void {
    this.isChangePasswordModalOpen = true;
    this.resetChangePasswordForm();
  }

  /**
   * Close the change password modal
   */
  closeChangePasswordModal(): void {
    this.isChangePasswordModalOpen = false;
    this.resetChangePasswordForm();
  }

  /**
   * Reset change password form
   */
  private resetChangePasswordForm(): void {
    this.changePasswordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.changePasswordError = null;
    this.changePasswordSuccess = null;
    this.changePasswordLoading = false;
  }

  /**
   * Handle change password submission
   */
  onChangePassword(): void {
    // Reset messages
    this.changePasswordError = null;
    this.changePasswordSuccess = null;

    // Validate form
    if (!this.changePasswordData.currentPassword || !this.changePasswordData.newPassword || !this.changePasswordData.confirmPassword) {
      this.changePasswordError = 'All fields are required';
      return;
    }

    if (this.changePasswordData.newPassword !== this.changePasswordData.confirmPassword) {
      this.changePasswordError = 'New password and confirmation do not match';
      return;
    }

    if (this.changePasswordData.newPassword.length < 6) {
      this.changePasswordError = 'New password must be at least 6 characters long';
      return;
    }

    if (this.changePasswordData.currentPassword === this.changePasswordData.newPassword) {
      this.changePasswordError = 'New password must be different from current password';
      return;
    }

    // Submit password change
    this.changePasswordLoading = true;
    this.authService.changePassword(this.changePasswordData).subscribe({
      next: (response) => {
        this.changePasswordLoading = false;
        if (response.message) {
          this.changePasswordSuccess = response.message;
          // Auto close modal after 2 seconds
          setTimeout(() => {
            this.closeChangePasswordModal();
          }, 2000);
        } else if (response.error) {
          this.changePasswordError = response.error;
        }
      },
      error: (error) => {
        this.changePasswordLoading = false;
        this.changePasswordError = error.error?.error || 'An error occurred while changing password';
      }
    });
  }
}
