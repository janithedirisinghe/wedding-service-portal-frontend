import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { PostService } from '../../vender/services/post.service';
import { PostModel } from '../../vender/models/post.model';

@Component({
  selector: 'app-vender-profile-customer',
  templateUrl: './vender-profile-customer.component.html',
  styleUrls: ['./vender-profile-customer.component.scss']
})
export class VenderProfileCustomerComponent implements OnInit {
  vendor: any = null;
  reviews: any[] = [];
  selectedTab: string = 'posts';
  reviewRating: number = 0;
  isLoading: boolean = false;
  error: string | null = null;
  vendorId: number | null = null;

  // Posts data
  posts: PostModel[] = [];
  postsLoading: boolean = false;
  postsError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private postService: PostService
  ) {}

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
  }

  loadVendorDetails(): void {
    if (!this.vendorId) return;

    this.isLoading = true;
    this.error = null;

    this.customerService.getVendorDetails(this.vendorId).subscribe({
      next: (response) => {
        if (response) {
          this.vendor = response;
          this.loadMockReviews(); // Load mock reviews for now
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

  private loadMockReviews(): void {
    // Mock reviews - replace with actual API call when available
    this.reviews = [
      { name: 'John Doe', location: 'City, State', date: '2023-01-01', rating: 4.5, text: 'Great service!' },
      { name: 'Jane Smith', location: 'City, State', date: '2023-02-01', rating: 4.0, text: 'Very satisfied!' },
      { name: 'Alice Johnson', location: 'City, State', date: '2023-03-01', rating: 5.0, text: 'Highly recommend!' }
    ];
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
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
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
}
