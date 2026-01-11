import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="notification-icon-button"
      (click)="togglePanel()"
      [class.has-notifications]="unreadCount > 0"
      type="button">
      
      <div class="icon-container">
        <i class="fas fa-bell text-xl"></i>
        
        <!-- Unread count badge -->
        <span 
          *ngIf="unreadCount > 0" 
          class="notification-badge"
          [class.large-count]="unreadCount > 99">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </div>
    </button>
  `,
  styles: [`
    .notification-icon-button {
      @apply relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors;
    }

    .notification-icon-button.has-notifications {
      @apply text-blue-600;
    }

    .icon-container {
      @apply relative;
    }

    .notification-badge {
      @apply absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-5;
      font-size: 10px;
    }

    .notification-badge.large-count {
      @apply px-1 w-auto min-w-6;
    }

    /* Animation for new notifications */
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }

    .notification-icon-button.has-notifications .notification-badge {
      animation: pulse 2s infinite;
    }

    .notification-icon-button:hover .notification-badge {
      animation: none;
      transform: scale(1.05);
    }
  `]
})
export class NotificationIconComponent implements OnInit, OnDestroy {
  @Output() toggleNotificationPanel = new EventEmitter<void>();
  
  unreadCount: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscribe to unread count updates
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });

    // Initial load of unread count
    this.loadUnreadCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUnreadCount(): void {
    this.notificationService.getUnreadCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => {
          this.unreadCount = count;
        },
        error: (error) => {
          console.error('Error loading unread count:', error);
        }
      });
  }

  togglePanel(): void {
    this.toggleNotificationPanel.emit();
  }
}
