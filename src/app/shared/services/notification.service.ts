import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError, BehaviorSubject, switchMap, filter, of } from 'rxjs';
import { AuthService } from './auth.service';
import { 
  NotificationResponseDTO, 
  NotificationPageResponse, 
  NotificationDisplay,
  NotificationType,
  NotificationPriority 
} from '../Models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiUrl = 'http://localhost:8080/api/notifications';
  
  // Subject to track unread notification count
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  // Subject to track real-time notifications
  private notificationsSubject = new BehaviorSubject<NotificationDisplay[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
 
  /**
   * Get notifications for the current user with pagination
   */
  getUserNotifications(page: number = 0, size: number = 20): Observable<NotificationPageResponse> {
    // Wait for auth to be initialized before making API calls
    return this.authService.authInitialized$.pipe(
      filter(initialized => initialized), // Wait until auth is initialized
      switchMap(() => {
        const userId = this.authService.getUserId();
        
        if (!userId) {
          // User is not authenticated, return empty response instead of error
          return of({
            content: [],
            pageable: {
              pageNumber: page,
              pageSize: size,
              sort: { empty: true, sorted: false, unsorted: true },
              offset: 0,
              paged: true,
              unpaged: false
            },
            totalElements: 0,
            totalPages: 0,
            last: true,
            size: size,
            number: page,
            sort: { empty: true, sorted: false, unsorted: true },
            first: true,
            numberOfElements: 0,
            empty: true
          } as NotificationPageResponse);
        }

        const params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString());

        return this.http.get<NotificationPageResponse>(
          `${this.apiUrl}/user/${userId}`,
          { params, withCredentials: true }
        );
      }),
      map(response => {
        // Update unread count
        const unreadCount = response.content.filter(n => !n.isRead).length;
        this.unreadCountSubject.next(unreadCount);
        
        // Convert and update notifications subject
        const displayNotifications = this.convertToDisplayNotifications(response.content);
        if (page === 0) {
          // If it's the first page, replace all notifications
          this.notificationsSubject.next(displayNotifications);
        } else {
          // If it's a subsequent page, append to existing notifications
          const currentNotifications = this.notificationsSubject.value;
          this.notificationsSubject.next([...currentNotifications, ...displayNotifications]);
        }
        
        return response;
      }),
      catchError(error => {
        console.error('Error fetching notifications:', error);
        // Return empty response instead of throwing error
        return of({
          content: [],
          pageable: {
            pageNumber: page,
            pageSize: size,
            sort: { empty: true, sorted: false, unsorted: true },
            offset: 0,
            paged: true,
            unpaged: false
          },
          totalElements: 0,
          totalPages: 0,
          last: true,
          size: size,
          number: page,
          sort: { empty: true, sorted: false, unsorted: true },
          first: true,
          numberOfElements: 0,
          empty: true
        } as NotificationPageResponse);
      })
    );
  }

  /**
   * Get recent notifications (for navbar/header display)
   */
  getRecentNotifications(limit: number = 5): Observable<NotificationDisplay[]> {
    return this.getUserNotifications(0, limit).pipe(
      map(response => this.convertToDisplayNotifications(response.content))
    );
  }

  /**
   * Mark a notification as read
   */
  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${notificationId}/read`,
      {},
      { withCredentials: true }
    ).pipe(
      map(() => {
        // Update local state
        this.updateLocalNotificationReadStatus(notificationId, true);
        return { success: true };
      }),
      catchError(error => {
        console.error('Error marking notification as read:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Mark multiple notifications as read
   */
  markMultipleAsRead(notificationIds: number[]): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/mark-read`,
      { notificationIds },
      { withCredentials: true }
    ).pipe(
      map(() => {
        // Update local state
        notificationIds.forEach(id => {
          this.updateLocalNotificationReadStatus(id, true);
        });
        return { success: true };
      }),
      catchError(error => {
        console.error('Error marking notifications as read:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Mark all notifications as read for current user
   */
  markAllAsRead(): Observable<any> {
    const userId = this.authService.getUserId();
    
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.put(
      `${this.apiUrl}/user/${userId}/mark-all-read`,
      {},
      { withCredentials: true }
    ).pipe(
      map(() => {
        // Update local state - mark all as read
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(n => ({
          ...n,
          isRead: true,
          readAt: new Date()
        }));
        this.notificationsSubject.next(updatedNotifications);
        this.unreadCountSubject.next(0);
        return { success: true };
      }),
      catchError(error => {
        console.error('Error marking all notifications as read:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a notification
   */
  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${notificationId}`,
      { withCredentials: true }
    ).pipe(
      map(() => {
        // Remove from local state
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.filter(n => n.id !== notificationId);
        this.notificationsSubject.next(updatedNotifications);
        
        // Update unread count
        const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
        this.unreadCountSubject.next(unreadCount);
        
        return { success: true };
      }),
      catchError(error => {
        console.error('Error deleting notification:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): Observable<number> {
    const userId = this.authService.getUserId();
    
    if (!userId) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.get<{ count: number }>(
      `${this.apiUrl}/user/${userId}/unread-count`,
      { withCredentials: true }
    ).pipe(
      map(response => {
        this.unreadCountSubject.next(response.count);
        return response.count;
      }),
      catchError(error => {
        console.error('Error fetching unread count:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Refresh notifications (force reload from server)
   */
  refreshNotifications(): Observable<NotificationPageResponse> {
    return this.getUserNotifications(0, 20);
  }

  /**
   * Convert backend DTOs to display format
   */
  private convertToDisplayNotifications(notifications: NotificationResponseDTO[]): NotificationDisplay[] {
    return notifications.map(notification => ({
      id: notification.notificationId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      isRead: notification.isRead,
      createdAt: new Date(notification.createdAt),
      readAt: notification.readAt ? new Date(notification.readAt) : null,
      relatedEntityId: notification.relatedEntityId
    }));
  }

  /**
   * Update local notification read status
   */
  private updateLocalNotificationReadStatus(notificationId: number, isRead: boolean): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(notification => {
      if (notification.id === notificationId) {
        return {
          ...notification,
          isRead,
          readAt: isRead ? new Date() : null
        };
      }
      return notification;
    });
    
    this.notificationsSubject.next(updatedNotifications);
    
    // Update unread count
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  /**
   * Get notification type display text
   */
  getNotificationTypeDisplayText(type: NotificationType): string {
    const typeMap: { [key in NotificationType]: string } = {
      [NotificationType.BOOKING_REQUEST]: 'Booking Request',
      [NotificationType.BOOKING_ACCEPTED]: 'Booking Accepted',
      [NotificationType.BOOKING_REJECTED]: 'Booking Rejected',
      [NotificationType.BOOKING_CANCELLED]: 'Booking Cancelled',
      [NotificationType.BOOKING_COMPLETED]: 'Booking Completed',
      
      [NotificationType.MEETING_REQUEST]: 'Meeting Request',
      [NotificationType.MEETING_ACCEPTED]: 'Meeting Accepted',
      [NotificationType.MEETING_REJECTED]: 'Meeting Rejected',
      [NotificationType.MEETING_CANCELLED]: 'Meeting Cancelled',
      [NotificationType.MEETING_REMINDER]: 'Meeting Reminder',
      
      [NotificationType.PAYMENT_RECEIVED]: 'Payment Received',
      [NotificationType.PAYMENT_PENDING]: 'Payment Pending',
      [NotificationType.PAYMENT_FAILED]: 'Payment Failed',
      
      [NotificationType.REVIEW_RECEIVED]: 'Review Received',
      [NotificationType.FOLLOW_REQUEST]: 'Follow Request',
      
      [NotificationType.SYSTEM_ANNOUNCEMENT]: 'System Announcement',
      [NotificationType.GENERAL]: 'General Notification'
    };
    
    return typeMap[type] || 'Notification';
  }

  /**
   * Get notification priority CSS class
   */
  getPriorityClass(priority: NotificationPriority): string {
    const priorityMap: { [key in NotificationPriority]: string } = {
      [NotificationPriority.LOW]: 'priority-low',
      [NotificationPriority.NORMAL]: 'priority-normal', 
      [NotificationPriority.HIGH]: 'priority-high',
      [NotificationPriority.URGENT]: 'priority-urgent'
    };
    
    return priorityMap[priority] || 'priority-low';
  }
}
