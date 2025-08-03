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
    private vendorApiUrl = `${environment.apiUrl}/vendors/`;

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
    updateCustomerProfile(userId: number | null, customerDTO: Partial<CustomerDetails>): Observable<CustomerDetails> {
        return this.http.put<CustomerDetails>(`${this.apiUrl}editCustomer/${userId}`, customerDTO, {
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

    /**
     * Get vendor details by vendor ID
     * @param vendorId - The ID of the vendor to fetch
     * @returns Observable containing vendor details
     */
    getVendorDetails(vendorId: number): Observable<any> {
        return this.http.get<any>(`${this.vendorApiUrl}getvendor/${vendorId}`, {
            withCredentials: true
        });
    }
}
