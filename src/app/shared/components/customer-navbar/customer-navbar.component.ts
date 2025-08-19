import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CustomerService } from '../../../features/customer/services/customer.service';
import { CustomerDetails } from '../../../features/customer/models/customer.model';
import { NotificationService } from '../../services/notification.service';
import { NotificationDisplay, NotificationType } from '../../Models/notification.model';

@Component({
  selector: 'app-customer-navbar',
  templateUrl: './customer-navbar.component.html',
  styleUrl: './customer-navbar.component.scss'
})
export class CustomerNavbarComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  showNotifications: boolean = false;
  showProfileDropdown: boolean = false;
  
  // Notification data
  notifications: NotificationDisplay[] = [];
  unreadNotifications: number = 0;
  loadingNotifications: boolean = false;
  
  // User data
  userName: string = '';
  userRole: string = '';
  
  // Customer data
  customer: CustomerDetails | null = null;
  defaultProfileImage = 'assets/placeholder-vendor.jpg';
  imageError = false;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadCustomerDetails();
    this.setupNotifications();
    
    // Listen for route changes to refresh user data
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadUserData();
      this.loadCustomerDetails();
    });
    
    // Refresh data every 10 seconds to catch login state changes
    setInterval(() => {
      this.loadUserData();
      this.loadCustomerDetails();
    }, 10000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupNotifications(): void {
    // Subscribe to unread count updates
    this.notificationService.unreadCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => {
        this.unreadNotifications = count;
      });

    // Subscribe to notifications updates
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications.slice(0, 5); // Show only recent 5 in navbar
      });

    // Load initial notifications
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loadingNotifications = true;
    this.notificationService.getRecentNotifications(5)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.loadingNotifications = false;
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          this.loadingNotifications = false;
        }
      });
  }

  loadUserData() {
    try {
      // Get user data through AuthService which handles storage fallbacks
      const username = this.authService.getUserName();
      const userRole = this.authService.getUserRole();
      
      this.userName = username || 'Guest User';
      this.userRole = this.formatRole(userRole || '');
    } catch (error) {
      // Silent error handling
      this.userName = 'Guest User';
      this.userRole = 'User';
    }
  }

  private loadCustomerDetails(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.customerService.getCustomerDetails(userId).subscribe({
        next: (customer) => {
          this.customer = customer;
          this.imageError = false;
          // Update userName with customer full name if available
          this.userName = this.getCustomerDisplayName() || this.userName;
        },
        error: (error) => {
          console.error('Error loading customer details:', error);
        }
      });
    }
  }

  onImageError(event: Event): void {
    this.imageError = true;
  }

  getCustomerInitials(): string {
    if (!this.customer) return 'C';
    
    const firstName = this.customer.firstName || '';
    const lastName = this.customer.lastName || '';
    
    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (this.customer.userName) {
      return this.customer.userName.charAt(0).toUpperCase();
    }
    
    return 'C';
  }

  getCustomerDisplayName(): string {
    if (!this.customer) return '';
    
    if (this.customer.firstName && this.customer.lastName) {
      return `${this.customer.firstName} ${this.customer.lastName}`;
    } else if (this.customer.firstName) {
      return this.customer.firstName;
    } else if (this.customer.userName) {
      return this.customer.userName;
    }
    
    return '';
  }

  formatRole(role: string): string {
    switch(role.toUpperCase()) {
      case 'VENDOR': return 'Wedding Vendor';
      case 'CUSTOMER': return 'Customer';
      case 'ADMIN': return 'Administrator';
      default: return 'User';
    }
  }
  
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfileDropdown = false; // Close profile dropdown
    
    // Refresh notifications when opening
    if (this.showNotifications) {
      this.loadNotifications();
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
    
    // Navigate based on notification type
    if (notification) {
      this.handleNotificationClick(notification);
    }
  }

  handleNotificationClick(notification: NotificationDisplay): void {
    // Close dropdown
    this.showNotifications = false;
    
    // Navigate based on notification type - customer-focused routes
    switch (notification.type) {
      case 'BOOKING_REQUEST':
      case 'BOOKING_ACCEPTED':
      case 'BOOKING_REJECTED':
      case 'BOOKING_CANCELLED':
      case 'BOOKING_COMPLETED':
        this.router.navigate(['/customer/timeline']); // Customer's timeline to see booking updates
        break;
        
      case 'MEETING_REQUEST':
      case 'MEETING_ACCEPTED':
      case 'MEETING_REJECTED':
      case 'MEETING_CANCELLED':
      case 'MEETING_REMINDER':
        this.router.navigate(['/customer/timeline']); // Customer's timeline for meeting updates
        break;
        
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_PENDING':
      case 'PAYMENT_FAILED':
        this.router.navigate(['/customer/timeline'], { fragment: 'payments' });
        break;
        
      case 'REVIEW_RECEIVED':
        this.router.navigate(['/customer/profile'], { fragment: 'reviews' });
        break;
        
      case 'FOLLOW_REQUEST':
        this.router.navigate(['/customer/profile'], { fragment: 'following' });
        break;
        
      default:
        // For general notifications, stay on current page
        break;
    }
  }

  getNotificationIcon(type: NotificationType): string {
    const iconMap: { [key in NotificationType]: string } = {
      // Booking related
      [NotificationType.BOOKING_REQUEST]: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      [NotificationType.BOOKING_ACCEPTED]: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      [NotificationType.BOOKING_REJECTED]: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
      [NotificationType.BOOKING_CANCELLED]: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728',
      [NotificationType.BOOKING_COMPLETED]: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      
      // Meeting related  
      [NotificationType.MEETING_REQUEST]: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
      [NotificationType.MEETING_ACCEPTED]: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      [NotificationType.MEETING_REJECTED]: 'M6 18L18 6M6 6l12 12',
      [NotificationType.MEETING_CANCELLED]: 'M6 18L18 6M6 6l12 12',
      [NotificationType.MEETING_REMINDER]: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
      
      // Payment related
      [NotificationType.PAYMENT_RECEIVED]: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
      [NotificationType.PAYMENT_PENDING]: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      [NotificationType.PAYMENT_FAILED]: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z',
      
      // Social related
      [NotificationType.REVIEW_RECEIVED]: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      [NotificationType.FOLLOW_REQUEST]: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      
      // System related
      [NotificationType.SYSTEM_ANNOUNCEMENT]: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
      [NotificationType.GENERAL]: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    
    return iconMap[type] || 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';
  }

  getNotificationBgColor(type: NotificationType): string {
    const colorMap: { [key in NotificationType]: string } = {
      // Booking related
      [NotificationType.BOOKING_REQUEST]: 'bg-blue-100 text-blue-500',
      [NotificationType.BOOKING_ACCEPTED]: 'bg-green-100 text-green-500',
      [NotificationType.BOOKING_REJECTED]: 'bg-red-100 text-red-500',
      [NotificationType.BOOKING_CANCELLED]: 'bg-red-100 text-red-500',
      [NotificationType.BOOKING_COMPLETED]: 'bg-green-100 text-green-600',
      
      // Meeting related
      [NotificationType.MEETING_REQUEST]: 'bg-purple-100 text-purple-500',
      [NotificationType.MEETING_ACCEPTED]: 'bg-green-100 text-green-500',
      [NotificationType.MEETING_REJECTED]: 'bg-red-100 text-red-500',
      [NotificationType.MEETING_CANCELLED]: 'bg-orange-100 text-orange-500',
      [NotificationType.MEETING_REMINDER]: 'bg-yellow-100 text-yellow-600',
      
      // Payment related
      [NotificationType.PAYMENT_RECEIVED]: 'bg-green-100 text-green-500',
      [NotificationType.PAYMENT_PENDING]: 'bg-yellow-100 text-yellow-600',
      [NotificationType.PAYMENT_FAILED]: 'bg-red-100 text-red-500',
      
      // Social related
      [NotificationType.REVIEW_RECEIVED]: 'bg-yellow-100 text-yellow-500',
      [NotificationType.FOLLOW_REQUEST]: 'bg-blue-100 text-blue-500',
      
      // System related
      [NotificationType.SYSTEM_ANNOUNCEMENT]: 'bg-purple-100 text-purple-500',
      [NotificationType.GENERAL]: 'bg-gray-100 text-gray-500'
    };
    
    return colorMap[type] || 'bg-gray-100 text-gray-500';
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

  viewAllNotifications(): void {
    this.showNotifications = false;
    // Navigate to a dedicated notifications page - adjust route as needed
    this.router.navigate(['/notifications']);
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showNotifications = false; // Close notifications dropdown
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  viewProfile() {
    this.showProfileDropdown = false;
    this.router.navigate(['/customer/customer-profile']);
  }

  viewBookings() {
    this.showProfileDropdown = false;
    this.router.navigate(['/customer/favorites']); // Assuming bookings are shown in timeline
  }

  viewFavorites() {
    this.showProfileDropdown = false;
    this.router.navigate(['/customer/favorites']);
  }

  viewSettings() {
    this.showProfileDropdown = false;
    this.router.navigate(['/customer/favorites']);
  }

  // Close dropdowns when clicking outside
  closeDropdowns() {
    this.showNotifications = false;
    this.showProfileDropdown = false;
  }

  // Method to manually refresh user data (can be called after login)
  refreshUserData() {
    this.loadUserData();
  }
}
