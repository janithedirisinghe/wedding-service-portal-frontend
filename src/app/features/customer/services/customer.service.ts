import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CustomerDetails } from "../models/customer.model";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class CustomerService {

    private apiUrl = `${environment.apiUrl}/customers/`; 

    constructor(private http: HttpClient) {}

    /**
     * Fetch customer details by customer ID
     * @param customerId - The ID of the customer to fetch
     * @returns Observable containing customer details
     */
    getCustomerDetails(userId: number): Observable<CustomerDetails> {
        return this.http.get<CustomerDetails>(`${this.apiUrl}user/${userId}`, {
            withCredentials: true
        });
    }

    /**
     * Update customer profile
     * @param customerId - The ID of the customer to update
     * @param customerData - The updated customer data
     * @returns Observable containing updated customer details
     */
    updateCustomerProfile(customerId: number, customerData: Partial<CustomerDetails>): Observable<CustomerDetails> {
        return this.http.put<CustomerDetails>(`${this.apiUrl}${customerId}`, customerData, {
            withCredentials: true
        });
    }

    /**
     * Get current customer profile (authenticated user)
     * @returns Observable containing current customer details
     */
    getCurrentCustomerProfile(): Observable<CustomerDetails> {
        return this.http.get<CustomerDetails>(`${this.apiUrl}profile`, {
            withCredentials: true
        });
    }
}
