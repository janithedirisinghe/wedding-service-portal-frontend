import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, catchError, throwError } from "rxjs";
import { CustomerDetails, CustomerStats } from "../models/customer.model";
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
 * Update customer profile (JSON data only)
 * @param userId - The ID of the customer to update
 * @param customerData - The updated customer data
 * @returns Observable containing updated customer details
 */
updateCustomerProfile(userId: number | null, customerDTO: Partial<CustomerDetails>): Observable<CustomerDetails> {
    return this.http.put<CustomerDetails>(`${this.apiUrl}editCustomer/${userId}`, customerDTO, {
        withCredentials: true
    });
}

/**
 * Update customer profile with image
 * @param userId - The ID of the customer to update
 * @param customerData - The updated customer data
 * @param profileImage - The profile image file
 * @returns Observable containing updated customer details
 */
updateCustomerProfileWithImage(userId: number | null, customerDTO: Partial<CustomerDetails>, profileImage: File): Observable<CustomerDetails> {
    console.log('Updating customer profile with image:', {
        userId,
        customerDTO,
        profileImageName: profileImage.name,
        profileImageSize: profileImage.size,
        profileImageType: profileImage.type
    });

    if (!userId) {
        throw new Error('User ID is required for profile update');
    }

    const formData = new FormData();
    
    // Create a clean DTO that matches the backend CustomerDTO structure
    const backendCustomerDTO: any = {
        customerId: customerDTO.customerId,
        firstName: customerDTO.firstName,
        lastName: customerDTO.lastName,
        phoneNumber: customerDTO.phoneNumber,
        bio: customerDTO.bio || '',
        address: customerDTO.address || '',
        city: customerDTO.city || '',
        country: customerDTO.country || '',
        budget: customerDTO.budget || '',
        preferredVendorTypes: customerDTO.preferredVendorTypes || [],
        userName: customerDTO.userName,
        userEmail: customerDTO.userEmail
    };

    // Handle dates properly - Spring Boot expects specific date format
    if (customerDTO.weddingDate) {
        backendCustomerDTO.weddingDate = new Date(customerDTO.weddingDate).toISOString();
    }
    if (customerDTO.dateOfBirth) {
        backendCustomerDTO.dateOfBirth = new Date(customerDTO.dateOfBirth).toISOString();
    }
    
    console.log('Backend DTO:', backendCustomerDTO);
    
    // Create JSON blob for customer data with correct content type
    const customerJson = JSON.stringify(backendCustomerDTO);
    const customerBlob = new Blob([customerJson], { 
        type: 'application/json'
    });
    
    // Append parts with exact names expected by Spring Boot
    formData.append('customer', customerBlob, 'customer.json');
    formData.append('profileImage', profileImage, profileImage.name);
    
    console.log('FormData contents:');
    console.log('- customer part: JSON blob with', customerJson.length, 'characters');
    console.log('- profileImage part:', profileImage.name, 'size:', profileImage.size, 'type:', profileImage.type);
    
    const url = `${this.apiUrl}editCustomerWithImage/${userId}`;
    console.log('Request URL:', url);
    
    return this.http.put<CustomerDetails>(url, formData, {
        withCredentials: true
        // Important: Don't set Content-Type header - let browser set it with boundary
    }).pipe(
        catchError((error: any) => {
            console.error('Error in updateCustomerProfileWithImage:', error);
            
            // If we get a 403 or multipart error, try the alternative method
            if (error.status === 403 || error.status === 400) {
                console.log('Trying alternative upload method...');
                return this.updateCustomerProfileWithImageAlt(userId, customerDTO, profileImage);
            }
            
            return throwError(() => error);
        })
    );
}

/**
 * Alternative method for updating customer profile with image using different approach
 */
updateCustomerProfileWithImageAlt(userId: number | null, customerDTO: Partial<CustomerDetails>, profileImage: File): Observable<CustomerDetails> {
    if (!userId) {
        throw new Error('User ID is required for profile update');
    }

    console.log('Using alternative upload method');
    
    const formData = new FormData();
    
    // Alternative approach: create a simpler DTO structure
    const simpleCustomerDTO: any = {
        firstName: customerDTO.firstName,
        lastName: customerDTO.lastName,
        phoneNumber: customerDTO.phoneNumber,
        bio: customerDTO.bio || '',
        address: customerDTO.address || '',
        city: customerDTO.city || '',
        country: customerDTO.country || '',
        budget: customerDTO.budget || '',
        userName: customerDTO.userName,
        userEmail: customerDTO.userEmail
    };

    // Add dates if they exist
    if (customerDTO.weddingDate) {
        simpleCustomerDTO.weddingDate = customerDTO.weddingDate;
    }
    if (customerDTO.dateOfBirth) {
        simpleCustomerDTO.dateOfBirth = customerDTO.dateOfBirth;
    }
    if (customerDTO.preferredVendorTypes && customerDTO.preferredVendorTypes.length > 0) {
        simpleCustomerDTO.preferredVendorTypes = customerDTO.preferredVendorTypes;
    }
    
    // Try sending as plain JSON string instead of Blob
    formData.append('customer', JSON.stringify(simpleCustomerDTO));
    formData.append('profileImage', profileImage);
    
    console.log('Alternative method - Customer data:', simpleCustomerDTO);
    console.log('Alternative method - Making request to:', `${this.apiUrl}editCustomerWithImage/${userId}`);
    
    return this.http.put<CustomerDetails>(`${this.apiUrl}editCustomerWithImage/${userId}`, formData, {
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
        return this.http.get<any>(`${this.vendorApiUrl}getvenderByVenderId/${vendorId}`, {
            withCredentials: true
        });
    }

    /**
     * Test endpoint accessibility for debugging
     */
    testEndpointAccess(userId: number): Observable<any> {
        console.log('Testing endpoint access for user:', userId);
        const testUrl = `${this.apiUrl}editCustomer/${userId}`;
        console.log('Test URL:', testUrl);
        
        return this.http.get<any>(testUrl, {
            withCredentials: true
        }).pipe(
            catchError((error: any) => {
                console.error('Endpoint test failed:', error);
                return throwError(() => error);
            })
        );
    }

    /**
     * Get customer stats (bookings, reviews, favorites count)
     * @param userId - The ID of the customer
     * @returns Observable containing customer stats
     */
    getCustomerStats(userId: number): Observable<CustomerStats> {
        return this.http.get<CustomerStats>(`${this.apiUrl}stats/${userId}`, {
            withCredentials: true
        });
    }
}
