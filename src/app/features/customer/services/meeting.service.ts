import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MeetingRequestDTO, MeetingDTO, CreateMeetingRequest } from '../models/meeting.model';
import { AuthService } from '../../../shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = 'http://localhost:8080/api/meetings';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Create a new meeting request
   */
  createMeetingRequest(userId: number, meetingRequest: CreateMeetingRequest): Observable<MeetingDTO> {
    const headers = this.getHeaders();
    
    // Convert the CreateMeetingRequest to MeetingRequestDTO format
    const requestPayload: MeetingRequestDTO = {
      meetingDateTime: meetingRequest.meetingDateTime,
      meetingMood: meetingRequest.meetingMood,
      location: meetingRequest.location,
      vendorId: meetingRequest.vendorId,
      notes: meetingRequest.notes
    };

    return this.http.post<MeetingDTO>(`${this.apiUrl}/request/${userId}`, requestPayload, { headers, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get meetings for a specific customer
   */
  getCustomerMeetings(customerId: number): Observable<MeetingDTO[]> {
    const headers = this.getHeaders();
    return this.http.get<MeetingDTO[]>(`${this.apiUrl}/customer/${customerId}`, { headers, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get a specific meeting by ID
   */
  getMeetingById(meetingId: number): Observable<MeetingDTO> {
    const headers = this.getHeaders();
    return this.http.get<MeetingDTO>(`${this.apiUrl}/${meetingId}`, { headers, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cancel a meeting
   */
  cancelMeeting(meetingId: number): Observable<MeetingDTO> {
    const headers = this.getHeaders();
    return this.http.put<MeetingDTO>(`${this.apiUrl}/${meetingId}/cancel`, {}, { headers, withCredentials: true })
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
    console.error('Meeting service error:', error);
    
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
