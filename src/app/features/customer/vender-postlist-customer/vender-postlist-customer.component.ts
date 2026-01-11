import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PostService } from '../../vender/services/post.service';
import { PostModel } from '../../vender/models/post.model';

@Component({
  selector: 'app-vender-postlist-customer',
  templateUrl: './vender-postlist-customer.component.html',
  styleUrl: './vender-postlist-customer.component.scss'
})
export class VenderPostlistCustomerComponent implements OnChanges {
  @Input() vendorId: number | undefined;
  
  // Posts data
  posts: PostModel[] = [];
  loading: boolean = false;
  error: string | null = null;
  
  constructor(private postService: PostService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vendorId'] && this.vendorId) {
      this.fetchVendorPosts(this.vendorId);
      console.log(`Fetching posts for vendor ID: ${this.vendorId}`);
    }
  }

  fetchVendorPosts(vendorId: number): void {
    this.loading = true;
    this.error = null;
    
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
        
        this.loading = false;
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
        
        this.error = errorMessage;
        this.loading = false;
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
