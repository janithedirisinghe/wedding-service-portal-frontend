import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { venderDetails } from '../models/vender.model';
import { VendorProfileService } from '../services/venderProfile.service';
import { VenderHeaderComponent } from '../../../shared/components/vender-header/vender-header.component';
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../services/post.service';
import { PostModel } from '../models/post.model';
import { VendorReviewService } from '../services/review.service';
import { ReviewDTO } from '../models/review.model';
import { ChangePasswordRequest } from '../../../shared/Models/change-password.model';

@Component({
  selector: 'app-vender-profile',
  templateUrl: './vender-profile.component.html',
  standalone: true,
  imports: [CommonModule, VenderHeaderComponent, ReactiveFormsModule, FormsModule], // Import FormsModule
  styleUrls: ['./vender-profile.component.css']
})
export class VenderProfileComponent implements OnInit {
  vendor: venderDetails | null = null; 
  error: string = ''; 
  showMore: boolean = false;
  
  // Posts related properties
  posts: PostModel[] = [];
  postsLoading: boolean = false;
  postsError: string | null = null;
  userId: number = -1;
  
  // Reviews related properties
  reviews: ReviewDTO[] = [];
  reviewsLoading: boolean = false;
  reviewsError: string | null = null;
  
  // Edit profile modal properties
  showEditModal: boolean = false;
  editProfileForm: FormGroup;
  isSubmitting: boolean = false;
  editError: string | null = null;
  editSuccess: string | null = null;
  selectedProfileImage: File | null = null;
  previewImageUrl: string | null = null;
  
  // Change password modal properties
  isChangePasswordModalOpen: boolean = false;
  changePasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  changePasswordLoading: boolean = false;
  changePasswordError: string | null = null;
  changePasswordSuccess: string | null = null;
  
  constructor(
    private vendorProfileService: VendorProfileService, 
    @Inject(PLATFORM_ID) private platformId: Object, 
    public authService: AuthService,
    private postService: PostService,
    private formBuilder: FormBuilder,
    private vendorReviewService: VendorReviewService
  ) {
    // Initialize edit profile form
    this.editProfileForm = this.formBuilder.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      bio: ['', [Validators.maxLength(500)]],
      telNo: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      location: ['', [Validators.required]],
      country: ['', [Validators.required]],
      brn: ['', [Validators.required]],
      venType: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.authService.getUserId());
    this.getvenderDetails(this.userId);
    this.fetchPosts(this.userId);
    this.fetchReviews(this.userId);
  }
  selectedTab: string = 'posts';
   getVenderProfileDetails(venderId: number){
   }

  getvenderDetails(venderId: number) {
    if (isPlatformBrowser(this.platformId)) {    
      if (venderId && !isNaN(Number(venderId))) {
        this.vendorProfileService.getVendorProfileDetails(Number(venderId)).subscribe(
          (data) => {
            this.vendor = data;
            console.log(data);
          },
          (error) => {
            this.error = 'Failed to load vendor data';
            console.error(error);
          }
        );
      } else {
        this.error = 'Invalid vendor ID';
        console.error('Invalid vendor ID');
      }
    }
  }

  fetchPosts(vendorId: number): void {
    this.postsLoading = true;
    this.postsError = null;
    
    this.postService.getPostsByVendorId(vendorId).subscribe({
      next: (posts) => {
        // Sort posts by date (newest first) and postId (highest first) as secondary sort
        this.posts = posts.sort((a, b) => {
          // First sort by date
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          if (dateA.getTime() !== dateB.getTime()) {
            return dateB.getTime() - dateA.getTime(); // Newest first
          }
          
          // If dates are equal, sort by postId (highest first)
          return (b.postId || 0) - (a.postId || 0);
        });
        
        this.postsLoading = false;
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
        this.postsError = 'Failed to load posts. Please try again.';
        this.postsLoading = false;
      }
    });
  }

  fetchReviews(vendorId: number): void {
    this.reviewsLoading = true;
    this.reviewsError = null;
    
    this.vendorReviewService.getReviewsByVendorId(vendorId).subscribe({
      next: (reviews) => {
        // Sort reviews by creation date (newest first)
        this.reviews = reviews.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        
        this.reviewsLoading = false;
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
        this.reviewsError = 'Failed to load reviews. Please try again.';
        this.reviewsLoading = false;
      }
    });
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  // Helper method to format review date
  formatReviewDate(date: Date): string {
    const reviewDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return reviewDate.toLocaleDateString();
    }
  }

  // Helper method to calculate average rating
  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10; // Round to 1 decimal
  }

  // Helper method to get total reviews count
  getTotalReviews(): number {
    return this.reviews.length;
  }

  // Helper method to get rating breakdown
  getRatingBreakdown(): { [key: number]: { count: number; percentage: number } } {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    this.reviews.forEach(review => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        breakdown[rating as keyof typeof breakdown]++;
      }
    });

    const total = this.reviews.length;
    const result: { [key: number]: { count: number; percentage: number } } = {};
    
    for (let i = 5; i >= 1; i--) {
      result[i] = {
        count: breakdown[i as keyof typeof breakdown],
        percentage: total > 0 ? Math.round((breakdown[i as keyof typeof breakdown] / total) * 100) : 0
      };
    }
    
    return result;
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  // Edit Profile Methods
  openEditModal(): void {
    if (this.vendor) {
      // Populate form with current vendor data
      this.editProfileForm.patchValue({
        businessName: this.vendor.businessName || '',
        bio: this.vendor.bio || '',
        telNo: this.vendor.telNo || '',
        location: this.vendor.location || '',
        country: this.vendor.country || '',
        brn: this.vendor.brn || '',
        venType: this.vendor.VenType || ''
      });
      this.showEditModal = true;
      this.editError = null;
      this.editSuccess = null;
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editError = null;
    this.editSuccess = null;
    this.editProfileForm.reset();
    this.selectedProfileImage = null;
    this.previewImageUrl = null;
  }

  // Handle profile image selection
  onProfileImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.editError = 'Please select a valid image file (JPEG, PNG, or GIF).';
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.editError = 'Image size should not exceed 5MB.';
        return;
      }

      this.selectedProfileImage = file;
      this.editError = null;

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove selected image
  removeSelectedImage(): void {
    this.selectedProfileImage = null;
    this.previewImageUrl = null;
  }

  onSubmitEditProfile(): void {
    if (this.editProfileForm.valid && this.vendor) {
      this.isSubmitting = true;
      this.editError = null;
      
      const updatedVendor: venderDetails = {
        ...this.vendor,
        ...this.editProfileForm.value
      };

      // Check if profile image is selected
      if (this.selectedProfileImage) {
        // Update with image
        this.vendorProfileService.updateVendorProfileWithImage(this.userId, updatedVendor, this.selectedProfileImage).subscribe({
          next: (response: venderDetails) => {
            this.vendor = response;
            this.editSuccess = 'Profile updated successfully!';
            this.isSubmitting = false;
            
            // Close modal after 2 seconds
            setTimeout(() => {
              this.closeEditModal();
            }, 2000);
          },
          error: (error: any) => {
            console.error('Error updating profile with image:', error);
            this.editError = 'Failed to update profile. Please try again.';
            this.isSubmitting = false;
          }
        });
      } else {
        // Update without image
        this.vendorProfileService.updateVendorProfile(this.userId, updatedVendor).subscribe({
          next: (response: venderDetails) => {
            this.vendor = response;
            this.editSuccess = 'Profile updated successfully!';
            this.isSubmitting = false;
            
            // Close modal after 2 seconds
            setTimeout(() => {
              this.closeEditModal();
            }, 2000);
          },
          error: (error: any) => {
            console.error('Error updating profile:', error);
            this.editError = 'Failed to update profile. Please try again.';
            this.isSubmitting = false;
          }
        });
      }
    } else {
      this.editError = 'Please fill in all required fields correctly.';
    }
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.editProfileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.editProfileForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['maxlength']) return `${fieldName} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      if (field.errors['pattern']) return `Please enter a valid ${fieldName.toLowerCase()}`;
    }
    return '';
  }

  // Change Password Methods
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
