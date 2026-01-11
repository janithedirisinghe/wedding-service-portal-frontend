import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationIconComponent } from '../notification-icon/notification-icon.component';
import { NotificationPanelComponent } from '../notification-panel/notification-panel.component';
import { NotificationDisplay } from '../../Models/notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule, NotificationIconComponent, NotificationPanelComponent],
  template: `
    <div class="notification-dropdown" #dropdownRef>
      <!-- Notification Icon -->
      <app-notification-icon 
        (toggleNotificationPanel)="togglePanel()">
      </app-notification-icon>

      <!-- Notification Panel -->
      <div 
        *ngIf="isOpen" 
        class="notification-panel-container"
        (click)="$event.stopPropagation()">
        
        <app-notification-panel
          [maxHeight]="'400px'"
          [showActions]="true"
          (notificationClick)="onNotificationClick($event)">
        </app-notification-panel>
      </div>

      <!-- Backdrop -->
      <div 
        *ngIf="isOpen" 
        class="notification-backdrop"
        (click)="closePanel()">
      </div>
    </div>
  `,
  styles: [`
    .notification-dropdown {
      @apply relative;
    }

    .notification-panel-container {
      @apply absolute top-full right-0 z-50 mt-2;
      transform: translateX(0);
    }

    /* For mobile, center the panel */
    @media (max-width: 640px) {
      .notification-panel-container {
        @apply fixed top-16 left-4 right-4;
        transform: none;
      }
    }

    .notification-backdrop {
      @apply fixed inset-0 z-40;
      background-color: transparent;
    }

    /* Animation for panel */
    .notification-panel-container {
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
  isOpen: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Auto-close on route change
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closePanel();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
  }

  closePanel(): void {
    this.isOpen = false;
  }

  onNotificationClick(notification: NotificationDisplay): void {
    // Handle notification click - navigate to related page
    this.handleNotificationNavigation(notification);
    this.closePanel();
  }

  private handleNotificationNavigation(notification: NotificationDisplay): void {
    // Navigate based on notification type and related entity
    switch (notification.type) {
      case 'BOOKING_REQUEST':
      case 'BOOKING_ACCEPTED':
      case 'BOOKING_REJECTED':
      case 'BOOKING_CANCELLED':
      case 'BOOKING_COMPLETED':
        if (notification.relatedEntityId) {
          // Navigate to booking details
          this.router.navigate(['/booking', notification.relatedEntityId]);
        }
        break;
        
      case 'MEETING_REQUEST':
      case 'MEETING_ACCEPTED':
      case 'MEETING_REJECTED':
      case 'MEETING_CANCELLED':
      case 'MEETING_REMINDER':
        if (notification.relatedEntityId) {
          // Navigate to meetings/calendar
          this.router.navigate(['/meetings'], { 
            queryParams: { meetingId: notification.relatedEntityId } 
          });
        }
        break;
        
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_PENDING':
      case 'PAYMENT_FAILED':
        if (notification.relatedEntityId) {
          // Navigate to payment details
          this.router.navigate(['/payments', notification.relatedEntityId]);
        }
        break;
        
      case 'REVIEW_RECEIVED':
        if (notification.relatedEntityId) {
          // Navigate to reviews
          this.router.navigate(['/reviews'], { 
            queryParams: { reviewId: notification.relatedEntityId } 
          });
        }
        break;
        
      case 'FOLLOW_REQUEST':
        if (notification.relatedEntityId) {
          // Navigate to profile or followers page
          this.router.navigate(['/profile'], { 
            queryParams: { followerId: notification.relatedEntityId } 
          });
        }
        break;
        
      case 'SYSTEM_ANNOUNCEMENT':
      case 'GENERAL':
        // For general notifications, just mark as read (already handled by the panel)
        break;
        
      default:
        // For other types, just mark as read (already handled by the panel)
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close panel when clicking outside
    if (this.isOpen) {
      this.closePanel();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    if (this.isOpen) {
      this.closePanel();
    }
  }
}
