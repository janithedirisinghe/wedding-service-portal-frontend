import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface AdminNotificationResponseDTO {
  adminNotificationId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  priority: string;
  relatedEntityId: number;
  createdAt: string;
  readAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminNotificationService {
  private readonly apiUrl = `${environment.apiUrl}/api/admin/notifications`;

  // Subject to track unread notification count
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUnreadCount();
  }

  /**
   * Get all admin notifications with pagination
   */
  getAllNotifications(page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.apiUrl}`, { params });
  }

  /**
   * Get unread admin notifications
   */
  getUnreadNotifications(page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.apiUrl}/unread`, { params });
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(`${this.apiUrl}/unread-count`);
  }

  /**
   * Load unread count and update subject
   */
  loadUnreadCount(): void {
    this.getUnreadCount().subscribe({
      next: (response) => {
        this.unreadCountSubject.next(response.unreadCount);
      },
      error: (error) => {
        console.error('Error loading unread count:', error);
        this.unreadCountSubject.next(0);
      }
    });
  }

  /**
   * Mark a notification as read
   */
  markAsRead(notificationId: number): Observable<AdminNotificationResponseDTO> {
    return this.http.put<AdminNotificationResponseDTO>(`${this.apiUrl}/${notificationId}/read`, {})
      .pipe(
        tap(() => {
          // Refresh unread count after marking as read
          this.loadUnreadCount();
        })
      );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<{ message: string; updatedCount: number }> {
    return this.http.put<{ message: string; updatedCount: number }>(`${this.apiUrl}/mark-all-read`, {})
      .pipe(
        tap(() => {
          // Refresh unread count after marking all as read
          this.loadUnreadCount();
        })
      );
  }

  /**
   * Get notifications by type
   */
  getNotificationsByType(type: string, page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get(`${this.apiUrl}/type/${type}`, { params });
  }

  /**
   * Get available notification types
   */
  getNotificationTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/types`);
  }
}
