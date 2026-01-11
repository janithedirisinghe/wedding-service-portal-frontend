import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface BookingResponseDto {
  bookingId: number;
  eventDate: Date;
  eventLocation: string;
  specialRequirements?: string;
  proposedPrice: number;
  status: BookingStatus;
  requestDate: Date;
  responseDate?: Date;
  vendorNotes?: string;
  
  // Service details
  serviceId: number;
  serviceName: string;
  serviceDescription?: string;
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
  ACCEPTED = 'ACCEPTED',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

@Injectable({
  providedIn: 'root'
})
export class CustomerBookingService {
  private apiUrl = `${environment.apiUrl}/api/bookings`;

  constructor(private http: HttpClient) {}

  /**
   * Get all bookings for the current customer
   */
  getCustomerBookings(): Observable<BookingResponseDto[]> {
    return this.http.get<BookingResponseDto[]>(`${this.apiUrl}/customer`);
  }

  /**
   * Get booking details by ID
   */
  getBookingById(bookingId: number): Observable<BookingResponseDto> {
    return this.http.get<BookingResponseDto>(`${this.apiUrl}/${bookingId}`);
  }

  /**
   * Cancel a booking
   */
  cancelBooking(bookingId: number, reason?: string): Observable<any> {
    const payload = { reason };
    return this.http.put(`${this.apiUrl}/${bookingId}/cancel`, payload);
  }
}
