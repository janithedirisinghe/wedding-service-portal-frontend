import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services';
import { CustomerDetails } from '../models';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  profile: CustomerDetails | null = null;
  loading: boolean = false;
  error: string | null = null;

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
}
