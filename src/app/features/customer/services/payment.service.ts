import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PaymentRequestDto {
  bookingId: number;
  amount: number;
  currency?: string;
}

export interface PaymentConfirmationDto {
  stripePaymentIntentId: string;
}

export interface PaymentResponseDto {
  paymentIntentId: string;
  stripeClientSecret: string;  // Changed from clientSecret to match backend
  amount: number;
  currency: string;
  status: string;
  bookingId: number;
  customerId: number;
  vendorId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/api/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Create a payment intent for a booking
   */
  createPaymentIntent(paymentRequest: PaymentRequestDto): Observable<PaymentResponseDto> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    console.log('Sending payment intent request to:', `${this.apiUrl}/create-intent`);
    console.log('Request payload:', paymentRequest);

    return this.http.post<PaymentResponseDto>(`${this.apiUrl}/create-intent`, paymentRequest, { headers });
  }

  /**
   * Confirm payment after successful payment on frontend
   */
  confirmPayment(confirmationDto: PaymentConfirmationDto): Observable<PaymentResponseDto> {
    return this.http.post<PaymentResponseDto>(`${this.apiUrl}/confirm`, confirmationDto);
  }
}
