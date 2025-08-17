import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BookingRequest, BookingResponse } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/api/bookings`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new booking request
   * @param bookingRequest - The booking request data
   * @returns Observable containing the booking response
   */
  createBookingRequest(bookingRequest: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/request`, bookingRequest, {
      withCredentials: true
    });
  }

  /**
   * Get booking details by ID
   * @param bookingId - The ID of the booking
   * @returns Observable containing the booking details
   */
  getBookingById(bookingId: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.apiUrl}/${bookingId}`, {
      withCredentials: true
    });
  }

  /**
   * Get all bookings for a customer
   * @param customerId - The ID of the customer
   * @returns Observable containing the list of bookings
   */
  getCustomerBookings(customerId: number): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiUrl}/customer/${customerId}`, {
      withCredentials: true
    });
  }

  /**
   * Get all bookings for a vendor
   * @param vendorId - The ID of the vendor
   * @returns Observable containing the list of bookings
   */
  getVendorBookings(vendorId: number): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(`${this.apiUrl}/vendor/${vendorId}`, {
      withCredentials: true
    });
  }

  /**
   * Cancel a booking
   * @param bookingId - The ID of the booking to cancel
   * @returns Observable containing the updated booking
   */
  cancelBooking(bookingId: number): Observable<BookingResponse> {
    return this.http.put<BookingResponse>(`${this.apiUrl}/${bookingId}/cancel`, {}, {
      withCredentials: true
    });
  }
}
