import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ErrorHandler } from '../../../shared/utils/error-handler';

// Frontend interfaces for requests
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

// Backend response interfaces (matching your API responses)
export interface ForgotPasswordResponse {
  message: string;
  email: string;
  username: string;
  userId: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Standardized frontend response interfaces
export interface SendOtpResponse {
  success: boolean;
  message: string;
  email?: string;
  username?: string;
  userId?: string;
}

export interface ResetPasswordFinalResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private apiUrl = environment.apiUrl || 'http://localhost:8080'; // Update with your Spring Boot URL

  constructor(private http: HttpClient) {}

  /**
   * Send OTP to user's email for password reset
   * @param request - Contains email
   * @returns Observable with the API response
   */
  sendOtp(request: ForgotPasswordRequest): Observable<SendOtpResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ForgotPasswordResponse>(
      `${this.apiUrl}/auth/forgot-password`,
      request,
      { headers }
    ).pipe(
      map((response: ForgotPasswordResponse) => ({
        success: true,
        message: response.message,
        email: response.email,
        username: response.username,
        userId: response.userId
      })),
      catchError((error) => {
        // Handle backend error responses using the error handler
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        return throwError(() => ({
          success: false,
          message: errorMessage,
          error: error
        }));
      })
    );
  }

  /**
   * Reset password using OTP
   * @param request - Contains email, OTP, new password, and confirmation
   * @returns Observable with the API response
   */
  resetPassword(request: ResetPasswordRequest): Observable<ResetPasswordFinalResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<ResetPasswordResponse>(
      `${this.apiUrl}/auth/reset-password`,
      request,
      { headers }
    ).pipe(
      map((response: ResetPasswordResponse) => ({
        success: true,
        message: response.message
      })),
      catchError((error) => {
        // Handle backend error responses using the error handler
        const errorMessage = ErrorHandler.extractErrorMessage(error);
        return throwError(() => ({
          success: false,
          message: errorMessage,
          error: error
        }));
      })
    );
  }

  /**
   * Validate email format
   * @param email - Email to validate
   * @returns boolean indicating if email is valid
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate OTP format (6 digits)
   * @param otp - OTP to validate
   * @returns boolean indicating if OTP format is valid
   */
  isValidOtp(otp: string): boolean {
    const otpRegex = /^\d{6}$/;
    return otpRegex.test(otp);
  }

  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns object with validation result and message
   */
  validatePassword(password: string): { isValid: boolean; message: string } {
    if (!password || password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters long'
      };
    }
    
    return {
      isValid: true,
      message: 'Password is valid'
    };
  }
}
