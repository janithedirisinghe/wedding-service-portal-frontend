import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AdminNotificationService, AdminNotificationResponseDTO } from '../../../features/admin/services/admin-notification.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  showNotifications: boolean = false;
  showProfileMenu: boolean = false;
  adminName: string = 'Administrator';
  adminEmail: string = 'admin@wedease.com';
  unreadCount: number = 0;
  recentNotifications: AdminNotificationResponseDTO[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: AdminNotificationService
  ) {}

  ngOnInit(): void {
    // Get admin info from auth service
    const username = this.authService.getUserName();
    if (username) {
      this.adminName = username;
      this.adminEmail = `${username}@wedease.com`; // You can customize this
    }

    // Subscribe to unread count changes
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe((count: number) => {
        this.unreadCount = count;
      });

    // Load recent notifications
    this.loadRecentNotifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRecentNotifications(): void {
    this.notificationService.getAllNotifications(0, 5).subscribe({
      next: (response: any) => {
        this.recentNotifications = response.content || [];
      },
      error: (error: any) => {
        console.error('Error loading recent notifications:', error);
        this.recentNotifications = [];
      }
    });
  }

  markNotificationAsRead(notification: AdminNotificationResponseDTO): void {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.adminNotificationId).subscribe({
        next: () => {
          notification.isRead = true;
          this.loadRecentNotifications(); // Refresh the list
        },
        error: (error: any) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  viewAllNotifications(): void {
    this.showNotifications = false;
    this.router.navigate(['/admin/notifications']);
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

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false;

    if (this.showNotifications) {
      this.loadRecentNotifications();
    }
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false;
  }

  getInitials(): string {
    return this.adminName.charAt(0).toUpperCase();
  }

  changePassword() {
    this.showProfileMenu = false;
    this.router.navigate(['/admin/profile']);
  }

  signOut() {
    this.showProfileMenu = false;
    this.authService.logout();
  }
}
