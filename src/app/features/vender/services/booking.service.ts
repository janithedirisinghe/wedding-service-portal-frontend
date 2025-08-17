import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// DTO matching the backend BookingResponseDto
export interface BookingResponseDto {
  bookingId: number;
  eventDate: string; // Date from backend
  eventLocation: string;
  specialRequirements: string;
  proposedPrice: number;
  status: BookingStatus;
  requestDate: string; // LocalDateTime from backend
  responseDate: string; // LocalDateTime from backend
  vendorNotes: string;
  
  // Service details
  serviceId: number;
  serviceName: string;
  serviceDescription: string;
  servicePricing: number;
  
  // Vendor details
  vendorId: number;
  vendorBusinessName: string;
  vendorType: string;
  
  // Customer details
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface BookingActionRequest {
  bookingId: number;
  status: BookingStatus;
  rejectionReason?: string;
}

// DTO for booking decision request to backend
export interface BookingDecisionDto {
  accepted: boolean;
  vendorNotes: string; 
}

// Frontend model for display
export interface BookingRequest {
  bookingId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceCategory: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  totalAmount: number;
  paymentStatus: string;
  status: BookingStatus;
  specialRequests?: string;
  requestedAt: string;
  vendorId: number;
  serviceId: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  /**
   * Get all bookings for the current vendor
   */
  getVendorBookings(): Observable<BookingRequest[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.get<BookingResponseDto[]>(`${this.apiUrl}/vendor`, { headers })
      .pipe(
        map(dtos => dtos.map(dto => this.mapDtoToBookingRequest(dto)))
      );
  }

  /**
   * Respond to a booking request (accept/reject)
   */
  respondToBooking(bookingId: number, decision: BookingDecisionDto): Observable<BookingRequest> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    return this.http.put<BookingResponseDto>(`${this.apiUrl}/${bookingId}/respond`, decision, { headers })
      .pipe(
        map(dto => this.mapDtoToBookingRequest(dto))
      );
  }

  /**
   * Update booking status (accept/reject) - deprecated, use respondToBooking instead
   */
  updateBookingStatus(bookingId: number, action: BookingActionRequest): Observable<BookingRequest> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getAuthToken()}`
    });

    // This endpoint might need to be implemented in the backend
    return this.http.put<BookingResponseDto>(`${this.apiUrl}/${bookingId}/status`, action, { headers })
      .pipe(
        map(dto => this.mapDtoToBookingRequest(dto))
      );
  }

  /**
   * Accept a booking
   */
  acceptBooking(bookingId: number, vendorNotes?: string): Observable<BookingRequest> {
    const decision: BookingDecisionDto = {
      accepted: true,
      vendorNotes: vendorNotes || 'Booking accepted'
    };
    return this.respondToBooking(bookingId, decision);
  }

  /**
   * Reject a booking
   */
  rejectBooking(bookingId: number, rejectionReason?: string): Observable<BookingRequest> {
    const decision: BookingDecisionDto = {
      accepted: false,
      vendorNotes: rejectionReason || 'Booking rejected'
    };
    return this.respondToBooking(bookingId, decision);
  }

  /**
   * Map backend DTO to frontend model
   */
  private mapDtoToBookingRequest(dto: BookingResponseDto): BookingRequest {
    return {
      bookingId: dto.bookingId,
      customerName: `${dto.customerFirstName} ${dto.customerLastName}`,
      customerEmail: '', // Not provided in DTO - might need to be added to backend
      customerPhone: '', // Not provided in DTO - might need to be added to backend
      serviceName: dto.serviceName,
      serviceCategory: dto.vendorType, // Using vendor type as category
      eventDate: dto.eventDate,
      eventTime: this.extractTimeFromDate(dto.eventDate),
      eventLocation: dto.eventLocation,
      totalAmount: dto.proposedPrice,
      paymentStatus: this.determinePaymentStatus(dto.status),
      status: dto.status,
      specialRequests: dto.specialRequirements,
      requestedAt: dto.requestDate,
      vendorId: dto.vendorId,
      serviceId: dto.serviceId
    };
  }

  /**
   * Extract time from date string or return default
   */
  private extractTimeFromDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return '00:00';
    }
  }

  /**
   * Determine payment status based on booking status
   */
  private determinePaymentStatus(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'Paid';
      case BookingStatus.PENDING:
        return 'Pending';
      case BookingStatus.REJECTED:
      case BookingStatus.CANCELLED:
        return 'Cancelled';
      case BookingStatus.COMPLETED:
        return 'Completed';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get auth token from localStorage or wherever it's stored
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }
}
