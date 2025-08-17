import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { VendorMeetingDTO, MeetingActionRequest } from '../models/meeting.model';
import { AuthService } from '../../../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VendorMeetingService {
  private apiUrl = 'http://localhost:8080/api/meetings';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get all meeting requests for a vendor
   */
  getVendorMeetings(vendorId: number): Observable<VendorMeetingDTO[]> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}/vendor/${vendorId}`;
    console.log('Making API request to:', url); // Log the URL
    console.log('Request headers:', headers); // Log headers
    
    return this.http.get<VendorMeetingDTO[]>(url, { headers, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Confirm or reject a meeting request
   */
  updateMeetingStatus(vendorId: number | null, action: MeetingActionRequest): Observable<VendorMeetingDTO> {
    const headers = this.getHeaders();
    return this.http.put<VendorMeetingDTO>(`${this.apiUrl}/respond/${vendorId}`, action, { headers, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get a specific meeting by ID
   */
  getMeetingById(meetingId: number): Observable<VendorMeetingDTO> {
    const headers = this.getHeaders();
    return this.http.get<VendorMeetingDTO>(`${this.apiUrl}/${meetingId}`, { headers, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cancel a meeting
   */
  cancelMeeting(meetingId: number): Observable<VendorMeetingDTO> {
    const headers = this.getHeaders();
    return this.http.put<VendorMeetingDTO>(`${this.apiUrl}/${meetingId}/cancel`, {}, { headers, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get HTTP headers
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Vendor meeting service error:', error);
    
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.error || error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
