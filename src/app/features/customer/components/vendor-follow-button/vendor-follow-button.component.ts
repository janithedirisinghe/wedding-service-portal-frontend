import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FollowService } from '../../services/follow.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { FollowResponse } from '../../models/follow.model';
import { catchError, of, takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'app-vendor-follow-button',
  template: `
    <button
      class="px-4 py-2 text-sm font-medium rounded-lg shadow transition-colors duration-200"
      [class.bg-blue-600]="!isFollowing && !isLoading"
      [class.text-white]="!isFollowing && !isLoading"
      [class.bg-gray-300]="isFollowing && !isLoading"
      [class.text-gray-700]="isFollowing && !isLoading"
      [class.bg-gray-400]="isLoading"
      [class.text-gray-600]="isLoading"
      [disabled]="isLoading"
      (click)="toggleFollow()"
    >
      <span *ngIf="!isLoading">
        {{ isFollowing ? 'Unfollow' : 'Follow' }}
      </span>
      <span *ngIf="isLoading" class="flex items-center">
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isFollowing ? 'Unfollowing...' : 'Following...' }}
      </span>
    </button>
  `
})
export class VendorFollowButtonComponent implements OnInit, OnDestroy {
  @Input() vendorId!: number;
  @Input() isFollowing: boolean = false;
  @Output() followStatusChanged = new EventEmitter<boolean>();
  @Output() error = new EventEmitter<string>();

  isLoading = false;
  currentCustomerId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
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

  private loadCurrentCustomer() {
    // Get customer ID directly from auth service
    this.currentCustomerId = this.authService.getUserId();
    
    if (!this.currentCustomerId) {
      this.error.emit('Please login to follow vendors');
    }
  }

  toggleFollow() {
    if (!this.currentCustomerId) {
      this.error.emit('Please login to follow vendors');
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.followService.toggleFollow(this.currentCustomerId, this.vendorId, this.isFollowing)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error toggling follow status:', error);
          this.error.emit(`Failed to ${this.isFollowing ? 'unfollow' : 'follow'} vendor. Please try again.`);
          return of({ success: false, message: 'Failed to update follow status' });
        })
      )
      .subscribe((response: FollowResponse) => {
        this.isLoading = false;
        
        if (response.success) {
          this.isFollowing = !this.isFollowing;
          this.followStatusChanged.emit(this.isFollowing);
        } else {
          this.error.emit(response.message || `Failed to ${this.isFollowing ? 'unfollow' : 'follow'} vendor`);
        }
      });
  }
}
