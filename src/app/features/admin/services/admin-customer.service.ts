import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminCustomerDetailsDTO, ToggleCustomerActiveDTO } from '../models/customer.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminCustomerService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  /**
   * Get all customers with full details for admin
   */ 
  getAllCustomers(): Observable<AdminCustomerDetailsDTO[]> {
    return this.http.get<AdminCustomerDetailsDTO[]>(`${this.apiUrl}/customers/all`, { withCredentials: true });
  }

  /**
   * Toggle the active status of a customer
   * @param customerId The ID of the customer to update
   * @param isActive The new active status
   */
  toggleCustomerActiveStatus(customerId: number, isActive: boolean): Observable<string> {
    const data: ToggleCustomerActiveDTO = {
      customerId,
      isActive
    };
    return this.http.post<string>(`${this.apiUrl}/customers/toggle-active`, data, { withCredentials: true });
  }
}
