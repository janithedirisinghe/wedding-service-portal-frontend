import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

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
}
