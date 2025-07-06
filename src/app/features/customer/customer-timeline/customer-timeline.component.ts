import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, catchError, of } from 'rxjs';
import { TimelineService } from '../services/timeline.service';
import { FollowService } from '../services/follow.service';
import { AuthService } from '../../../shared/services/auth.service';
import { TimelinePostDTO, TimelineType, TimelineFilter } from '../models/timeline.model';

@Component({
  selector: 'app-customer-timeline',
  templateUrl: './customer-timeline.component.html',
  styleUrl: './customer-timeline.component.scss'
})
export class CustomerTimelineComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  timelineData: TimelinePostDTO[] = [];
  loading = false;
  error: string | null = null;
  currentCustomerId: number | null = null;
  followingInProgress = new Set<number>(); // Track which vendors are being followed/unfollowed
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  hasMoreData = true;
  
  // Timeline type (can be changed based on user selection)
  currentTimelineType: TimelineType = TimelineType.GENERAL;
  
  // Timeline types for template
  timelineTypes = [
    { key: TimelineType.GENERAL, label: 'General' },
    { key: TimelineType.FOLLOWING, label: 'Following' },
    { key: TimelineType.RECENT, label: 'Recent' },
    { key: TimelineType.EXPLORE, label: 'Explore' }
  ];

  constructor(
    private timelineService: TimelineService,
    private followService: FollowService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCurrentCustomer();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load current customer information from auth service
   */
  loadCurrentCustomer() {
    // Get customer ID directly from auth service
    this.currentCustomerId = this.authService.getUserId();
    
    if (!this.currentCustomerId) {
      this.error = 'Please login to view timeline';
      return;
    }
    
    this.loadTimelineData();
  }

  /**
   * Load timeline data based on current type
   */
  loadTimelineData(append = false) {
    if (this.loading) return;
    
    this.loading = true;
    this.error = null;
    
    const filter: TimelineFilter = {
      page: append ? this.currentPage + 1 : 0,
      size: this.pageSize
    };

    this.timelineService.getPostsByType(this.currentTimelineType, filter, this.currentCustomerId || undefined)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading timeline data:', error);
          this.error = 'Failed to load timeline data. Please try again.';
          return of([]);
        })
      )
      .subscribe(posts => {
        this.loading = false;
        
        if (append) {
          this.timelineData = [...this.timelineData, ...posts];
          this.currentPage++;
        } else {
          this.timelineData = posts;
          this.currentPage = 0;
        }
        
        this.hasMoreData = posts.length === this.pageSize;
        
        // Load follow status for the posts
        this.loadFollowStatus();
      });
  }

  /**
   * Load follow status for current timeline posts
   */
  loadFollowStatus() {
    if (!this.currentCustomerId || this.timelineData.length === 0) {
      return;
    }

    const vendorIds = this.timelineData.map(post => post.vendorId);
    
    this.followService.checkMultipleFollowStatus(this.currentCustomerId, vendorIds)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading follow status:', error);
          // Don't show error to user, just continue with default follow status
          return of({});
        })
      )
      .subscribe(followStatus => {
        this.timelineData.forEach(post => {
          post.isFollowing = (followStatus as {[vendorId: number]: boolean})[post.vendorId] || false;
        });
      });
  }

  /**
   * Load more timeline data (for infinite scroll)
   */
  loadMoreData() {
    if (this.hasMoreData && !this.loading) {
      this.loadTimelineData(true);
    }
  }

  /**
   * Switch timeline type and reload data
   */
  switchTimelineType(type: TimelineType) {
    if (type === TimelineType.FOLLOWING && !this.currentCustomerId) {
      this.error = 'Please login to view followed vendors posts';
      return;
    }
    
    this.currentTimelineType = type;
    this.loadTimelineData();
  }

  /**
   * Refresh timeline data
   */
  refreshTimeline() {
    this.loadTimelineData();
  }

  /**
   * Toggle follow status for a vendor
   */
  toggleFollow(post: TimelinePostDTO) {
    if (!this.currentCustomerId) {
      this.error = 'Please login to follow vendors';
      return;
    }

    if (this.followingInProgress.has(post.vendorId)) {
      return; // Already in progress
    }

    this.followingInProgress.add(post.vendorId);
    const currentFollowStatus = post.isFollowing || false;

    this.followService.toggleFollow(this.currentCustomerId, post.vendorId, currentFollowStatus)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error toggling follow status:', error);
          this.error = `Failed to ${currentFollowStatus ? 'unfollow' : 'follow'} vendor. Please try again.`;
          return of({ success: false, message: 'Failed to update follow status' });
        })
      )
      .subscribe(response => {
        this.followingInProgress.delete(post.vendorId);
        
        if (response.success) {
          // Update the follow status in the UI
          post.isFollowing = !currentFollowStatus;
          
          // Clear any previous errors
          this.error = null;
          
          // Show success message (optional)
          console.log(response.message);
          
          // If we're in the following timeline and user unfollowed, remove the post
          if (this.currentTimelineType === TimelineType.FOLLOWING && !post.isFollowing) {
            this.timelineData = this.timelineData.filter(p => p.postId !== post.postId);
          }
        } else {
          this.error = response.message || `Failed to ${currentFollowStatus ? 'unfollow' : 'follow'} vendor`;
        }
      });
  }

  /**
   * Check if a vendor follow operation is in progress
   */
  isFollowInProgress(vendorId: number): boolean {
    return this.followingInProgress.has(vendorId);
  }

  /**
   * Get formatted time display
   */
  getFormattedTime(createdAt: string): string {
    const postDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return postDate.toLocaleDateString();
  }

  /**
   * Get default profile image if vendor profile image is not available
   */
  getVendorImage(post: TimelinePostDTO): string {
    return post.vendorProfileImage || 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png';
  }

  /**
   * Handle image loading errors
   */
  onImageError(event: any) {
    event.target.src = 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png';
  }
}
