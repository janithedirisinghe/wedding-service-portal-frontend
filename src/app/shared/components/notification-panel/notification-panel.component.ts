import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { 
  NotificationDisplay, 
  NotificationPageResponse, 
  NotificationType, 
  NotificationPriority 
} from '../../Models/notification.model';

@Component({
  selector: 'app-notification-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-panel">
      <!-- Notification Header -->
      <div class="notification-header">
        <h3 class="text-lg font-semibold">Notifications</h3>
        <div class="notification-actions">
          <button 
            *ngIf="unreadCount > 0" 
            (click)="markAllAsRead()"
            class="text-sm text-blue-600 hover:text-blue-800">
            Mark all as read
          </button>
          <button 
            (click)="refreshNotifications()"
            class="text-sm text-gray-600 hover:text-gray-800 ml-2">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && notifications.length === 0" class="empty-state">
        <div class="text-center py-8">
          <i class="fas fa-bell text-gray-400 text-4xl mb-4"></i>
          <p class="text-gray-500">No notifications yet</p>
        </div>
      </div>

      <!-- Notifications List -->
      <div *ngIf="!loading && notifications.length > 0" class="notifications-list">
        <div 
          *ngFor="let notification of notifications" 
          class="notification-item"
          [class.unread]="!notification.isRead"
          [class]="getPriorityClass(notification.priority)">
          
          <div class="notification-content" (click)="markAsRead(notification.id)">
            <div class="notification-type-icon">
              <i [class]="getTypeIcon(notification.type)"></i>
            </div>
            
            <div class="notification-body">
              <h4 class="notification-title">{{ notification.title }}</h4>
              <p class="notification-message">{{ notification.message }}</p>
              
              <div class="notification-meta">
                <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                <span class="notification-type-badge">
                  {{ getTypeDisplayText(notification.type) }}
                </span>
              </div>
            </div>
            
            <div class="notification-actions">
              <button 
                *ngIf="!notification.isRead"
                (click)="markAsRead(notification.id); $event.stopPropagation()"
                class="mark-read-btn"
                title="Mark as read">
                <i class="fas fa-check"></i>
              </button>
              
              <button 
                (click)="deleteNotification(notification.id); $event.stopPropagation()"
                class="delete-btn"
                title="Delete notification">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div *ngIf="hasMoreNotifications && !loading" class="load-more-section">
        <button 
          (click)="loadMoreNotifications()"
          class="load-more-btn">
          Load More
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-panel {
      @apply bg-white rounded-lg shadow-lg max-w-md w-full max-h-96 overflow-hidden;
    }

    .notification-header {
      @apply flex justify-between items-center p-4 border-b border-gray-200;
    }

    .notification-actions {
      @apply flex items-center;
    }

    .loading-state, .empty-state {
      @apply p-4;
    }

    .notifications-list {
      @apply max-h-80 overflow-y-auto;
    }

    .notification-item {
      @apply border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors;
    }

    .notification-item.unread {
      @apply bg-blue-50 border-l-4 border-l-blue-500;
    }

    .notification-item.priority-urgent {
      @apply border-l-4 border-l-red-500;
    }

    .notification-item.priority-high {
      @apply border-l-4 border-l-orange-500;
    }

    .notification-item.priority-normal {
      @apply border-l-4 border-l-blue-500;
    }

    .notification-item.priority-low {
      @apply border-l-4 border-l-gray-400;
    }

    .notification-content {
      @apply flex items-start p-4 cursor-pointer;
    }

    .notification-type-icon {
      @apply flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 mr-3;
    }

    .notification-body {
      @apply flex-1 min-w-0;
    }

    .notification-title {
      @apply font-medium text-gray-900 text-sm mb-1;
    }

    .notification-message {
      @apply text-gray-600 text-sm mb-2 line-clamp-2;
    }

    .notification-meta {
      @apply flex items-center space-x-2 text-xs text-gray-500;
    }

    .notification-type-badge {
      @apply bg-gray-100 px-2 py-1 rounded-full;
    }

    .notification-actions {
      @apply flex flex-col space-y-1 ml-2;
    }

    .mark-read-btn, .delete-btn {
      @apply p-1 text-gray-400 hover:text-gray-600 transition-colors;
    }

    .delete-btn:hover {
      @apply text-red-500;
    }

    .load-more-section {
      @apply p-4 border-t border-gray-200;
    }

    .load-more-btn {
      @apply w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium;
    }
  `]
})
export class NotificationPanelComponent implements OnInit, OnDestroy {
  @Input() maxHeight: string = '400px';
  @Input() showActions: boolean = true;
  @Output() notificationClick = new EventEmitter<NotificationDisplay>();

  notifications: NotificationDisplay[] = [];
  unreadCount: number = 0;
  loading: boolean = false;
  hasMoreNotifications: boolean = false;
  
  private currentPage: number = 0;
  private pageSize: number = 20;
  private destroy$ = new Subject<void>();

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Wait for auth initialization before loading notifications
    this.authService.waitForAuthInitialization().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadNotifications();
      }
    });
    this.subscribeToNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadNotifications(): void {
    // Only load notifications if user is authenticated
    if (!this.authService.isLoggedIn()) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.notificationService.getUserNotifications(0, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: NotificationPageResponse) => {
          this.notifications = this.notificationService['convertToDisplayNotifications'](response.content);
          this.hasMoreNotifications = !response.last;
          this.currentPage = 0;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          this.loading = false;
        }
      });
  }

  private subscribeToNotifications(): void {
    // Subscribe to notifications updates
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
      });

    // Subscribe to unread count updates
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  loadMoreNotifications(): void {
    if (this.loading || !this.hasMoreNotifications) return;
    
    this.loading = true;
    const nextPage = this.currentPage + 1;
    
    this.notificationService.getUserNotifications(nextPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: NotificationPageResponse) => {
          const newNotifications = this.notificationService['convertToDisplayNotifications'](response.content);
          this.notifications = [...this.notifications, ...newNotifications];
          this.hasMoreNotifications = !response.last;
          this.currentPage = nextPage;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading more notifications:', error);
          this.loading = false;
        }
      });
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      this.notificationService.markAsRead(notificationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // Update handled by the service's BehaviorSubject
          },
          error: (error) => {
            console.error('Error marking notification as read:', error);
          }
        });
    }
    
    // Emit notification click event
    if (notification) {
      this.notificationClick.emit(notification);
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Update handled by the service's BehaviorSubject
        },
        error: (error) => {
          console.error('Error marking all notifications as read:', error);
        }
      });
  }

  deleteNotification(notificationId: number): void {
    this.notificationService.deleteNotification(notificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Update handled by the service's BehaviorSubject
        },
        error: (error) => {
          console.error('Error deleting notification:', error);
        }
      });
  }

  refreshNotifications(): void {
    this.currentPage = 0;
    this.loadNotifications();
  }

  getTypeIcon(type: NotificationType): string {
    const iconMap: { [key in NotificationType]: string } = {
      // Booking related
      [NotificationType.BOOKING_REQUEST]: 'fas fa-calendar-plus text-blue-500',
      [NotificationType.BOOKING_ACCEPTED]: 'fas fa-check-circle text-green-500',
      [NotificationType.BOOKING_REJECTED]: 'fas fa-times-circle text-red-500',
      [NotificationType.BOOKING_CANCELLED]: 'fas fa-ban text-red-500',
      [NotificationType.BOOKING_COMPLETED]: 'fas fa-check-double text-green-600',
      
      // Meeting related
      [NotificationType.MEETING_REQUEST]: 'fas fa-handshake text-purple-500',
      [NotificationType.MEETING_ACCEPTED]: 'fas fa-calendar-check text-green-500',
      [NotificationType.MEETING_REJECTED]: 'fas fa-calendar-times text-red-500',
      [NotificationType.MEETING_CANCELLED]: 'fas fa-calendar-minus text-orange-500',
      [NotificationType.MEETING_REMINDER]: 'fas fa-bell text-yellow-500',
      
      // Payment related
      [NotificationType.PAYMENT_RECEIVED]: 'fas fa-dollar-sign text-green-500',
      [NotificationType.PAYMENT_PENDING]: 'fas fa-clock text-yellow-500',
      [NotificationType.PAYMENT_FAILED]: 'fas fa-exclamation-triangle text-red-500',
      
      // Social related
      [NotificationType.REVIEW_RECEIVED]: 'fas fa-star text-yellow-500',
      [NotificationType.FOLLOW_REQUEST]: 'fas fa-user-plus text-blue-500',
      
      // System related
      [NotificationType.SYSTEM_ANNOUNCEMENT]: 'fas fa-bullhorn text-purple-500',
      [NotificationType.GENERAL]: 'fas fa-info-circle text-gray-500'
    };
    
    return iconMap[type] || 'fas fa-bell text-gray-500';
  }

  getTypeDisplayText(type: NotificationType): string {
    return this.notificationService.getNotificationTypeDisplayText(type);
  }

  getPriorityClass(priority: NotificationPriority): string {
    return this.notificationService.getPriorityClass(priority);
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  }
}
