import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { PostService } from '../../vender/services/post.service';
import { PostModel } from '../../vender/models/post.model';
import { ReviewService } from '../services/review.service';
import { ReviewModel, CreateReviewRequest } from '../models/review.model';
import { MeetingService } from '../services/meeting.service';
import { CreateMeetingRequest, MeetingMood } from '../models/meeting.model';
import { BookingService } from '../services/booking.service';
import { BookingRequest } from '../models/booking.model';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorStatsWithRatingDTO } from '../models/vendor-stats.model';

@Component({
  selector: 'app-vender-profile-customer',
  templateUrl: './vender-profile-customer.component.html',
  styleUrls: ['./vender-profile-customer.component.scss']
})
export class VenderProfileCustomerComponent implements OnInit {
  vendor: any = null;
  vendorStats: VendorStatsWithRatingDTO | null = null;
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

  // Services loading
  servicesLoading: boolean = false;
  servicesError: string | null = null;

  // Service booking modal
  showServiceBookingModal: boolean = false;
  selectedService: any = null;
  serviceBookingForm: FormGroup;
  isSubmittingServiceBooking: boolean = false;
  serviceBookingError: string | null = null;
  serviceBookingSuccess: string | null = null;

  // Appointment form
  appointmentForm: FormGroup; 
  isSubmittingAppointment: boolean = false;
  appointmentError: string | null = null;
  appointmentSuccess: string | null = null;
  meetingMoodOptions = [
    { label: 'Virtual Meeting', value: MeetingMood.VIRTUAL },
    { label: 'Phone Call', value: MeetingMood.PHONE_CALL },
    { label: 'In-Person Meeting', value: MeetingMood.IN_PERSON }
  ];

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private postService: PostService,
    private reviewService: ReviewService,
    private meetingService: MeetingService,
    private bookingService: BookingService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });

    this.appointmentForm = this.fb.group({
      meetingDateTime: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      meetingMood: [MeetingMood.VIRTUAL, [Validators.required]],
      location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      notes: ['', [Validators.maxLength(500)]]
    });

    this.serviceBookingForm = this.fb.group({
      eventDate: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      eventLocation: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      specialRequirements: ['', [Validators.maxLength(1000)]],
      proposedPrice: ['', [Validators.required, Validators.min(0)]]
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
  }

  loadVendorDetails(): void {
    if (!this.vendorId) return;

    this.isLoading = true;
    this.error = null;

    this.customerService.getVendorDetails(this.vendorId).subscribe({
      next: (response) => {
        if (response) {
          this.vendor = response;
          this.loadVendorStats(); // Load vendor stats
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

  loadVendorStats(): void {
    if (!this.vendorId) return;

    this.customerService.getVendorStatsWithRating(this.vendorId).subscribe({
      next: (stats) => {
        this.vendorStats = stats;
        console.log('Vendor stats loaded:', stats);
      },
      error: (error) => {
        console.error('Error loading vendor stats:', error);
        // Don't set main error for stats failure, just log it
        this.vendorStats = null;
      }
    });
  }

  loadVendorReviews(): void {
    if (!this.vendorId) return;

    this.reviewsLoading = true;
    this.reviewsError = null;

    this.reviewService.getReviewsByVendorIdVendorId(this.vendorId).subscribe({
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
  
    this.postService.getPostsByVendorIdByVenderId(this.vendorId).subscribe({
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

  // Custom validator for future dates
  futureDateValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null; // Don't validate empty values
    }
    
    const selectedDate = new Date(control.value);
    const now = new Date();
    
    return selectedDate > now ? null : { 'pastDate': { value: control.value } };
  }

  // Submit appointment
  submitAppointment(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentError = 'Please fill out all required fields correctly.';
      return;
    }

    if (!this.vendorId) {
      this.appointmentError = 'Vendor ID not found.';
      return;
    }

    const customerId = this.authService.getUserId();
    if (!customerId) {
      this.appointmentError = 'You must be logged in to book an appointment.';
      return;
    }

    this.isSubmittingAppointment = true;
    this.appointmentError = null;
    this.appointmentSuccess = null;

    // Format the datetime for the backend (yyyy-MM-dd HH:mm:ss format)
    const selectedDateTime = new Date(this.appointmentForm.value.meetingDateTime);
    const formattedDateTime = this.formatDateTimeForBackend(selectedDateTime);

    const appointmentData: CreateMeetingRequest = {
      meetingDateTime: formattedDateTime,
      meetingMood: this.appointmentForm.value.meetingMood,
      location: this.appointmentForm.value.location,
      vendorId: this.vendorId,
      notes: this.appointmentForm.value.notes
    };

    this.meetingService.createMeetingRequest(customerId, appointmentData).subscribe({
      next: (response) => {
        this.appointmentSuccess = 'Appointment request submitted successfully! The vendor will respond soon.';
        this.appointmentForm.reset();
        this.appointmentForm.patchValue({
          meetingMood: MeetingMood.VIRTUAL
        });
        
        // Auto-switch to posts tab after successful submission
        setTimeout(() => {
          this.selectedTab = 'posts';
          this.appointmentSuccess = null;
        }, 3000);
        
        this.isSubmittingAppointment = false;
      },
      error: (error) => {
        console.error('Error submitting appointment:', error);
        
        let errorMessage = 'Failed to submit appointment request. ';
        if (error.message) {
          errorMessage += error.message;
        } else {
          errorMessage += 'Please try again later.';
        }
        
        this.appointmentError = errorMessage;
        this.isSubmittingAppointment = false;
      }
    });
  }

  // Cancel appointment form
  cancelAppointment(): void {
    this.appointmentForm.reset();
    this.appointmentForm.patchValue({
      meetingMood: MeetingMood.VIRTUAL
    });
    this.appointmentError = null;
    this.appointmentSuccess = null;
    this.selectedTab = 'posts';
  }

  // Format date time for backend (yyyy-MM-dd HH:mm:ss)
  private formatDateTimeForBackend(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Get minimum datetime for input (current datetime)
  getMinDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Services-related methods
  loadVendorServices(): void {
    // Services are loaded as part of vendor details, so we can just reset error state
    this.servicesError = null;
    this.loadVendorDetails();
  }

  requestServiceBooking(service: any): void {
    if (!this.isLoggedIn()) {
      this.serviceBookingError = 'Please log in to request a booking.';
      return;
    }
    
    // Set the selected service and show modal
    this.selectedService = service;
    this.showServiceBookingModal = true;
    this.serviceBookingError = null;
    this.serviceBookingSuccess = null;
    
    // Reset the form
    this.serviceBookingForm.reset();
    
    // Scroll to top of modal content and setup scroll listener
    setTimeout(() => {
      this.scrollModalToTop();
      this.setupScrollListener();
    }, 100);
  }

  closeServiceBookingModal(): void {
    this.showServiceBookingModal = false;
    this.selectedService = null;
    this.serviceBookingError = null;
    this.serviceBookingSuccess = null;
    this.serviceBookingForm.reset();
  }

  submitServiceBooking(): void {
    console.log('Submit button clicked');
    console.log('Form valid:', this.serviceBookingForm.valid);
    console.log('Form value:', this.serviceBookingForm.value);
    console.log('Form errors:', this.serviceBookingForm.errors);
    
    // Check individual field validations
    Object.keys(this.serviceBookingForm.controls).forEach(key => {
      const control = this.serviceBookingForm.get(key);
      if (control && control.invalid) {
        console.log(`${key} is invalid:`, control.errors);
      }
    });

    if (this.serviceBookingForm.invalid) {
      this.serviceBookingError = 'Please fill out all required fields correctly.';
      // Scroll to error message
      this.scrollToElementInModal('.bg-red-100');
      return; 
    } 

    if (!this.selectedService || !this.vendorId) {
      this.serviceBookingError = 'Service or vendor information not found.';
      this.scrollToElementInModal('.bg-red-100');
      return;
    }

    const customerId = this.authService.getUserId();
    if (!customerId) {
      this.serviceBookingError = 'You must be logged in to submit a service booking.';
      this.scrollToElementInModal('.bg-red-100');
      return;
    }

    this.isSubmittingServiceBooking = true;
    this.serviceBookingError = null;
    this.serviceBookingSuccess = null;

    const eventDate = new Date(this.serviceBookingForm.value.eventDate);
    const bookingRequest: BookingRequest = {
      serviceId: this.selectedService.serviceId,
      eventDate: eventDate.toISOString(),
      eventLocation: this.serviceBookingForm.value.eventLocation,
      specialRequirements: this.serviceBookingForm.value.specialRequirements || undefined,
      proposedPrice: parseFloat(this.serviceBookingForm.value.proposedPrice)
    };

    this.bookingService.createBookingRequest(bookingRequest).subscribe({
      next: (response) => {
        this.serviceBookingSuccess = 'Service booking request submitted successfully! The vendor will contact you soon.';
        this.isSubmittingServiceBooking = false;
        
        // Scroll to success message
        this.scrollToElementInModal('.bg-green-100');
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          this.closeServiceBookingModal();
        }, 3000);
      },
      error: (error) => {
        console.error('Error submitting service booking:', error);
        this.serviceBookingError = 'Failed to submit service booking. Please try again.';
        this.isSubmittingServiceBooking = false;
        // Scroll to error message
        this.scrollToElementInModal('.bg-red-100');
      }
    });
  }

  getMinDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper method to scroll modal content to top
  private scrollModalToTop(): void {
    setTimeout(() => {
      const modalContent = document.querySelector('.service-booking-modal .flex-1.overflow-y-auto');
      if (modalContent) {
        modalContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  // Helper method to scroll to element within modal
  private scrollToElementInModal(selector: string): void {
    setTimeout(() => {
      const modalContent = document.querySelector('.service-booking-modal .flex-1.overflow-y-auto');
      const element = document.querySelector(selector);
      if (modalContent && element) {
        const elementRect = element.getBoundingClientRect();
        const modalRect = modalContent.getBoundingClientRect();
        const scrollTop = elementRect.top - modalRect.top + modalContent.scrollTop - 20;
        
        modalContent.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  // Setup scroll listener for visual indicators
  private setupScrollListener(): void {
    const modalContent = document.querySelector('.service-booking-modal .flex-1.overflow-y-auto');
    if (modalContent) {
      modalContent.addEventListener('scroll', () => {
        const scrollTop = modalContent.scrollTop;
        const scrollShadow = document.querySelector('.scroll-shadow-top');
        
        if (scrollShadow) {
          if (scrollTop > 10) {
            modalContent.classList.add('scrolled');
          } else {
            modalContent.classList.remove('scrolled');
          }
        }
      });
    }
  }

  toggleServiceFavorite(service: any): void {
    if (!this.isLoggedIn()) {
      return;
    }
    
    // Here you would implement the favorite functionality
    // For now, just show a message
    console.log('Toggling favorite for service:', service.name);
    
    // You could add a toast notification here
    // this.toastr.success('Service added to favorites!');
  }
}
