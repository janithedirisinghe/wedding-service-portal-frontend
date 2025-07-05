import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { venderDetails } from '../models/vender.model';
import { VendorProfileService } from '../services/venderProfile.service';
import { VenderHeaderComponent } from '../../../shared/components/vender-header/vender-header.component';
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../services/post.service';
import { PostModel } from '../models/post.model';

@Component({
  selector: 'app-vender-profile',
  templateUrl: './vender-profile.component.html',
  standalone: true,
  imports: [CommonModule, VenderHeaderComponent], // Import CommonModule and VenderHeaderComponent
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
  
  constructor(
    private vendorProfileService: VendorProfileService, 
    @Inject(PLATFORM_ID) private platformId: Object, 
    public authService: AuthService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const userId = Number(this.authService.getUserId());
    this.getvenderDetails(userId);
    this.fetchPosts(userId);
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
  reviews = [
    {
      name: 'Janith Edirisinghe',
      location: 'Anuradhapura',
      date: '2024.12.12',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inventore sed error repudiandae...'
    },
    {
      name: 'Janith Edirisinghe',
      location: 'Anuradhapura',
      date: '2024.12.12',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inventore sed error repudiandae...'
    },
    {
      name: 'Janith Edirisinghe',
      location: 'Anuradhapura',
      date: '2024.12.12',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inventore sed error repudiandae...'
    }
  ];

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}
