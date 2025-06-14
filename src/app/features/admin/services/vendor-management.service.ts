import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface VendorRequest {
  id: string;
  vendorName: string;
  registerNumber: string;
  vendorType: string;
  email: string;
  phone: string;
  businessAddress: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ActiveVendor {
  id: string;
  vendorName: string;
  registerNumber: string;
  vendorType: string;
  email: string;
  phone: string;
  businessAddress: string;
  approvedDate: Date;
  totalBookings: number;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class VendorManagementService {
  private apiUrl = '/api/admin/vendors'; // Replace with actual API URL

  constructor(private http: HttpClient) { }

  // Get all pending vendor requests
  getPendingVendorRequests(): Observable<VendorRequest[]> {
    // For now, return mock data. Replace with actual API call
    const mockData: VendorRequest[] = [
      {
        id: '1',
        vendorName: 'Royal Photography',
        registerNumber: 'REG001',
        vendorType: 'Photography',
        email: 'royal@photography.com',
        phone: '+1234567890',
        businessAddress: '123 Main St, City',
        requestDate: new Date('2024-01-15'),
        status: 'pending'
      },
      {
        id: '2',
        vendorName: 'Dream Decorations',
        registerNumber: 'REG002',
        vendorType: 'Decoration',
        email: 'dream@decorations.com',
        phone: '+1234567891',
        businessAddress: '456 Oak Ave, City',
        requestDate: new Date('2024-01-16'),
        status: 'pending'
      },
      {
        id: '3',
        vendorName: 'Elite Catering',
        registerNumber: 'REG003',
        vendorType: 'Catering',
        email: 'elite@catering.com',
        phone: '+1234567892',
        businessAddress: '789 Pine Rd, City',
        requestDate: new Date('2024-01-17'),
        status: 'pending'
      }
    ];
    
    return of(mockData).pipe(delay(500)); // Simulate API delay
    // return this.http.get<VendorRequest[]>(`${this.apiUrl}/requests`);
  }

  // Get all active vendors
  getActiveVendors(): Observable<ActiveVendor[]> {
    // For now, return mock data. Replace with actual API call
    const mockData: ActiveVendor[] = [
      {
        id: '101',
        vendorName: 'Perfect Moments Photography',
        registerNumber: 'REG101',
        vendorType: 'Photography',
        email: 'perfect@moments.com',
        phone: '+1234567800',
        businessAddress: '100 Camera St, City',
        approvedDate: new Date('2023-12-01'),
        totalBookings: 45,
        rating: 4.8
      },
      {
        id: '102',
        vendorName: 'Golden Spoon Catering',
        registerNumber: 'REG102',
        vendorType: 'Catering',
        email: 'golden@spoon.com',
        phone: '+1234567801',
        businessAddress: '200 Food Ave, City',
        approvedDate: new Date('2023-11-15'),
        totalBookings: 67,
        rating: 4.9
      },
      {
        id: '103',
        vendorName: 'Elegant Events Decoration',
        registerNumber: 'REG103',
        vendorType: 'Decoration',
        email: 'elegant@events.com',
        phone: '+1234567802',
        businessAddress: '300 Design Blvd, City',
        approvedDate: new Date('2023-10-20'),
        totalBookings: 34,
        rating: 4.7
      }
    ];
    
    return of(mockData).pipe(delay(500)); // Simulate API delay
    // return this.http.get<ActiveVendor[]>(`${this.apiUrl}/active`);
  }

  // Approve a vendor request
  approveVendor(vendorId: string): Observable<any> {
    // For now, return success response. Replace with actual API call
    return of({ success: true, message: 'Vendor approved successfully' }).pipe(delay(300));
    // return this.http.put(`${this.apiUrl}/approve/${vendorId}`, {});
  }

  // Reject a vendor request
  rejectVendor(vendorId: string): Observable<any> {
    // For now, return success response. Replace with actual API call
    return of({ success: true, message: 'Vendor rejected successfully' }).pipe(delay(300));
    // return this.http.put(`${this.apiUrl}/reject/${vendorId}`, {});
  }

  // Get vendor details by ID
  getVendorDetails(vendorId: string): Observable<VendorRequest | ActiveVendor> {
    // For now, return mock data. Replace with actual API call
    return of({} as VendorRequest).pipe(delay(300));
    // return this.http.get<VendorRequest | ActiveVendor>(`${this.apiUrl}/${vendorId}`);
  }
}
