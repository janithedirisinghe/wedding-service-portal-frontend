import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  bio: string;
  preferredVendorTypes: string[];
  weddingDate?: string;
  budget?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:8080/auth'; // Updated API URL

  constructor(private http: HttpClient) {}

  registerCustomer(customer: Customer): Observable<any> {
    return this.http.post<Customer>(`${this.baseUrl}/register`, customer, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    });
  }

  verifyOTP(otpData: {otp: string, email: string}): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/verify-otp`, otpData);
  }

  postCustomerDetails(customerInfo: CustomerInfo, userId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/customer-complete-info?userId=${userId}`, customerInfo);
  }
}
