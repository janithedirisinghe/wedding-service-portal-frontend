import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AdminNotificationService, AdminNotificationResponseDTO } from '../services/admin-notification.service';

@Component({
  selector: 'app-admin-notifications',
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.scss']
})
export class AdminNotificationsComponent implements OnInit, OnDestroy {
  notifications: AdminNotificationResponseDTO[] = [];
  unreadCount: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  totalElements: number = 0;
  totalPages: number = 0;
  loading: boolean = false;
  selectedType: string = '';
  notificationTypes: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(private notificationService: AdminNotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadNotificationTypes();

    // Subscribe to unread count changes
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNotifications(): void {
    this.loading = true;
    let observable;

    if (this.selectedType) {
      observable = this.notificationService.getNotificationsByType(this.selectedType, this.currentPage, this.pageSize);
    } else {
      observable = this.notificationService.getAllNotifications(this.currentPage, this.pageSize);
    }

    observable.subscribe({
      next: (response: any) => {
        this.notifications = response.content || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });
  }

  loadNotificationTypes(): void {
    this.notificationService.getNotificationTypes().subscribe({
      next: (types) => {
        this.notificationTypes = types;
      },
      error: (error) => {
        console.error('Error loading notification types:', error);
      }
    });
  }

  onTypeChange(): void {
    this.currentPage = 0;
    this.loadNotifications();
  }

  markAsRead(notification: AdminNotificationResponseDTO): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.adminNotificationId).subscribe({
        next: () => {
          notification.isRead = true;
          this.loadNotifications(); // Refresh the list
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: (response) => {
        console.log(response.message);
        this.loadNotifications(); // Refresh the list
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadNotifications();
  }

  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }
}
