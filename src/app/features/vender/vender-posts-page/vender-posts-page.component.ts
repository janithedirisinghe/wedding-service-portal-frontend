import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { PostModel } from '../models/post.model';

@Component({
  selector: 'app-vender-posts-page',
  templateUrl: './vender-posts-page.component.html',
  styleUrl: './vender-posts-page.component.scss'
})
export class VenderPostsPageComponent implements OnInit {
  posts: PostModel[] = [];
  loading: boolean = false;
  error: string | null = null;
  
  // Track the current main image index for each post
  postMainImageIndexes: { [postId: number]: number } = {};

  // For demo purposes - in real app, this would come from auth service
  vendorId: number = 1;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  fetchPosts(): void {
    this.loading = true;
    this.error = null;
    
    this.postService.getPostsByVendorId(this.vendorId).subscribe({
      next: (posts) => {
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
        
        // Initialize main image indexes for each post (default to 0)
        this.posts.forEach(post => {
          if (post.postId) {
            this.postMainImageIndexes[post.postId] = 0;
          }
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
        
        // Determine error type and provide appropriate message
        let errorMessage = 'Failed to load posts. ';
        
        if (error.status === 0) {
          errorMessage += 'Cannot connect to server. Please check if the backend is running on http://localhost:8080';
        } else if (error.status === 404) {
          errorMessage += 'Posts endpoint not found.';
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

  // Method to set the main image for a specific post
  setPostMainImage(postIndex: number, imageIndex: number): void {
    const post = this.posts[postIndex];
    if (post && post.postId && post.itemUrls && post.itemUrls[imageIndex]) {
      this.postMainImageIndexes[post.postId] = imageIndex;
    }
  }

  // Helper method to get the current main image for a post
  getPostMainImage(post: PostModel): string {
    if (!post.itemUrls || post.itemUrls.length === 0) {
      return 'https://untgtsclbjlgemwljimq.supabase.co/storage/v1/object/public/Wedding%20Vender%20managment%20System//bw4a0212.jpg';
    }
    
    const currentIndex = post.postId ? (this.postMainImageIndexes[post.postId] || 0) : 0;
    return post.itemUrls[currentIndex] || post.itemUrls[0];
  }

  // Helper method to check if a thumbnail is currently selected
  isImageSelected(post: PostModel, imageIndex: number): boolean {
    if (!post.postId) return imageIndex === 0;
    const currentIndex = this.postMainImageIndexes[post.postId] || 0;
    return currentIndex === imageIndex;
  }

  // Navigate to next image
  nextImage(post: PostModel): void {
    if (!post.postId || !post.itemUrls || post.itemUrls.length <= 1) return;
    
    const currentIndex = this.postMainImageIndexes[post.postId] || 0;
    const nextIndex = (currentIndex + 1) % post.itemUrls.length;
    this.postMainImageIndexes[post.postId] = nextIndex;
  }

  // Navigate to previous image
  previousImage(post: PostModel): void {
    if (!post.postId || !post.itemUrls || post.itemUrls.length <= 1) return;
    
    const currentIndex = this.postMainImageIndexes[post.postId] || 0;
    const prevIndex = currentIndex === 0 ? post.itemUrls.length - 1 : currentIndex - 1;
    this.postMainImageIndexes[post.postId] = prevIndex;
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
}
