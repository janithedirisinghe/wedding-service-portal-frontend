import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { PostService } from '../../vender/services/post.service';
import { PostModel } from '../../vender/models/post.model';
import { ReviewService } from '../services/review.service';
import { ReviewModel, CreateReviewRequest } from '../models/review.model';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-vender-profile-customer',
  templateUrl: './vender-profile-customer.component.html',
  styleUrls: ['./vender-profile-customer.component.scss']
})
export class VenderProfileCustomerComponent implements OnInit {
  vendor: any = null;
  reviews: ReviewModel[] = [];
  selectedTab: string = 'posts';
  reviewRating: number = 0;
  isLoading: boolean = false;
  error: string | null = null;
  vendorId: number | null = null;

  // Posts data
  posts: PostModel[] = [];
  postsLoading: boolean = false;
  postsError: string | null = null;

  // Review form
  reviewForm: FormGroup;
  isSubmittingReview: boolean = false;
  reviewError: string | null = null;
  reviewSuccess: string | null = null;

  // Reviews loading
  reviewsLoading: boolean = false;
  reviewsError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private postService: PostService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.vendorId = params['vendorId'] ? parseInt(params['vendorId']) : null;
      console.log(`Vendor ID from query params vender profile customer: ${this.vendorId}`);
        if (this.vendorId) {
          this.loadVendorDetails();
        } else {
          this.error = 'Vendor ID not provided';
        }
      });
    
    // Set up rating form control sync
    this.reviewForm.get('rating')?.valueChanges.subscribe(value => {
      this.reviewRating = value;
    });
  }  loadVendorDetails(): void {
    if (!this.vendorId) return;

    this.isLoading = true;
    this.error = null;

    this.customerService.getVendorDetails(this.vendorId).subscribe({
      next: (response) => {
        if (response) {
          this.vendor = response;
          this.loadVendorReviews(); // Load real reviews
          this.loadVendorPosts(); // Load vendor posts
        } else {
          this.error = 'Vendor not found';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vendor details:', error);
        this.error = 'Failed to load vendor details';
        this.isLoading = false;
      }
    });
  }

  loadVendorReviews(): void {
    if (!this.vendorId) return;

    this.reviewsLoading = true;
    this.reviewsError = null;

    this.reviewService.getReviewsByVendorId(this.vendorId).subscribe({
      next: (reviews) => {
        console.log('Raw reviews from API:', reviews);
        this.reviews = reviews.sort((a, b) => {
          // Sort by creation date (newest first)
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        });
        console.log('Sorted reviews:', this.reviews);
        this.reviewsLoading = false;
      },
      error: (error) => {
        console.error('Error fetching vendor reviews:', error);
        
        let errorMessage = 'Failed to load reviews. ';
        if (error.status === 0) {
          errorMessage += 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.status === 404) {
          errorMessage += 'No reviews found for this vendor.';
          this.reviews = []; // Set empty array for no reviews
          this.reviewsLoading = false;
          return;
        } else if (error.status === 500) {
          errorMessage += 'Server error occurred.';
        } else {
          errorMessage += `Server responded with error: ${error.status}`;
        }
        
        this.reviewsError = errorMessage;
        this.reviewsLoading = false;
      }
    });
  }

  loadVendorPosts(): void {
    if (!this.vendorId) return;

    this.postsLoading = true;
    this.postsError = null;
  
    this.postService.getPostsByVendorId(this.vendorId).subscribe({
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
        console.error('Error fetching vendor posts:', error);
        
        // Determine error type and provide appropriate message
        let errorMessage = 'Failed to load posts. ';
        
        if (error.status === 0) {
          errorMessage += 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.status === 404) {
          errorMessage += 'Posts not found.';
        } else if (error.status === 500) {
          errorMessage += 'Server error occurred.';
        } else {
          errorMessage += `Server responded with error: ${error.status}`;
        }
        
        this.postsError = errorMessage;
        this.postsLoading = false;
      }
    });
  }

  // Helper method to format date
  formatDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    if (!date || isNaN(date.getTime())) {
      return 'Unknown date';
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }

  // Helper method to get customer initials
  getCustomerInitials(customerId: number | null): string {
    if (customerId === null) {
      return 'AN'; // Anonymous
    }
    return `C${customerId.toString().slice(-2)}`;
  }

  // Helper method to get customer display name
  getCustomerDisplayName(customerId: number | null): string {
    if (customerId === null) {
      return 'Anonymous Customer';
    }
    return `Customer #${customerId}`;
  }

  // Review rating methods
  setRating(rating: number): void {
    this.reviewRating = rating;
    this.reviewForm.patchValue({ rating: rating });
  }

  // Submit review
  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewError = 'Please fill out all required fields correctly.';
      return;
    }

    if (!this.vendorId) {
      this.reviewError = 'Vendor ID not found.';
      return;
    }

    const customerId = this.authService.getUserId();
    if (!customerId) {
      this.reviewError = 'You must be logged in to submit a review.';
      return;
    }

    this.isSubmittingReview = true;
    this.reviewError = null;
    this.reviewSuccess = null; 

    const reviewData: CreateReviewRequest = {
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      vendorId: this.vendorId,
      customerId: customerId
    };

    this.reviewService.createReview(reviewData).subscribe({
      next: (response) => {
        this.reviewSuccess = 'Review submitted successfully!';
        this.reviewForm.reset();
        this.reviewRating = 0;
        this.loadVendorReviews(); // Reload reviews to show the new one
        
        // Auto-switch to reviews tab after successful submission
        setTimeout(() => {
          this.selectedTab = 'reviews';
          this.reviewSuccess = null;
        }, 2000);
        
        this.isSubmittingReview = false;
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        
        let errorMessage = 'Failed to submit review. ';
        if (error.status === 0) {
          errorMessage += 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.status === 400) {
          errorMessage += 'Invalid review data. Please check your input.';
        } else if (error.status === 401) {
          errorMessage += 'You must be logged in to submit a review.';
        } else if (error.status === 409) {
          errorMessage += 'You have already reviewed this vendor.';
        } else if (error.status === 500) {
          errorMessage += 'Server error occurred.';
        } else {
          errorMessage += `Server responded with error: ${error.status}`;
        }
        
        this.reviewError = errorMessage;
        this.isSubmittingReview = false;
      }
    });
  }

  // Cancel review form
  cancelReview(): void {
    this.reviewForm.reset();
    this.reviewRating = 0;
    this.reviewError = null;
    this.reviewSuccess = null;
    this.selectedTab = 'reviews';
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Get current user role
  getUserRole(): string | null {
    return this.authService.getUserRole();
  }
}
