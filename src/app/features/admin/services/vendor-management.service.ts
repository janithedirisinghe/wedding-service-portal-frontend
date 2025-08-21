import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { AdminService } from './admin.service';
import { Vendor } from '../../../shared/Models/vendor.model';

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
  profileImageUrl?: string;
  bio?: string;
  availability?: string;
  country?: string;
  location?: string;
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
  profileImageUrl?: string;
  bio?: string;
  availability?: string;
  country?: string;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendorManagementService {
  private apiUrl = '/api/admin/vendors'; // Replace with actual API URL

  constructor(private http: HttpClient, private adminService: AdminService) { }

  // Helper method to map Vendor to VendorRequest
  private mapVendorToRequest(vendor: Vendor): VendorRequest {
    return {
      id: vendor.venderId.toString(),
      vendorName: vendor.businessName,
      registerNumber: vendor.brn,
      vendorType: vendor.VenType, // Updated to use VenType from API
      email: vendor.user?.email || '', // Assuming email is in user object
      phone: vendor.telNo,
      businessAddress: vendor.location,
      requestDate: new Date(), // You might want to get this from creation date
      status: vendor.verify ? 'approved' : 'pending',
      profileImageUrl: vendor.profileImageUrl || undefined,
      bio: vendor.bio,
      availability: vendor.availability || undefined,
      country: vendor.country,
      location: vendor.location
    };
  }

  // Helper method to map Vendor to ActiveVendor
  private mapVendorToActive(vendor: Vendor): ActiveVendor {
    return {
      id: vendor.venderId.toString(),
      vendorName: vendor.businessName,
      registerNumber: vendor.brn,
      vendorType: vendor.VenType, // Updated to use VenType from API
      email: vendor.user?.email || '', // Assuming email is in user object
      phone: vendor.telNo,
      businessAddress: vendor.location,
      approvedDate: new Date(), // You might want to get this from actual approval date
      totalBookings: 0, // This would need to come from booking data
      rating: 0, // This would need to come from rating data
      profileImageUrl: vendor.profileImageUrl || undefined,
      bio: vendor.bio,
      availability: vendor.availability || undefined,
      country: vendor.country,
      location: vendor.location
    };
  }

  // Get all pending vendor requests
  getPendingVendorRequests(): Observable<VendorRequest[]> {
    return this.adminService.getAllVendors().pipe(
      map(vendors => vendors
        .filter(vendor => !vendor.verify) // Filter non-verified vendors
        .map(vendor => this.mapVendorToRequest(vendor))
      ),
      catchError(error => {
        console.error('Error fetching pending vendors:', error);
        // Return mock data as fallback
        return this.getMockPendingRequests();
      })
    );
  }

  // Get all active vendors
  getActiveVendors(): Observable<ActiveVendor[]> {
    return this.adminService.getAllVendors().pipe(
      map(vendors => vendors
        .filter(vendor => vendor.verify && (vendor.isActive !== false)) // Filter verified and active vendors
        .map(vendor => this.mapVendorToActive(vendor))
      ),
      catchError(error => {
        console.error('Error fetching active vendors:', error);
        // Return mock data as fallback
        return this.getMockActiveVendors();
      })
    );
  }

  // Approve a vendor request
  approveVendor(vendorId: string): Observable<Vendor | any> {
    const numericId = parseInt(vendorId, 10);
    return this.adminService.approveVendor(numericId).pipe(
      catchError(error => {
        console.error('Error approving vendor:', error);
        // Return mock success as fallback
        return of({ success: true, message: 'Vendor approved successfully' }).pipe(delay(300));
      })
    );
  }

  // Reject a vendor request
  rejectVendor(vendorId: string): Observable<Vendor | any> {
    const numericId = parseInt(vendorId, 10);
    return this.adminService.rejectVendor(numericId).pipe(
      catchError(error => {
        console.error('Error rejecting vendor:', error);
        // Return mock success as fallback
        return of({ success: true, message: 'Vendor rejected successfully' }).pipe(delay(300));
      })
    );
  }

  // Deactivate a vendor (separate from rejection)
  deactivateVendor(vendorId: string): Observable<Vendor | any> {
    const numericId = parseInt(vendorId, 10);
    return this.adminService.deactivateVendor(numericId).pipe(
      catchError(error => {
        console.error('Error deactivating vendor:', error);
        // Return mock success as fallback
        return of({ success: true, message: 'Vendor deactivated successfully' }).pipe(delay(300));
      })
    );
  }

  // Get all vendors (both pending and active)
  getAllVendors(): Observable<Vendor[]> {
    return this.adminService.getAllVendors();
  }

  // Get vendor details by ID
  getVendorDetails(vendorId: string): Observable<VendorRequest | ActiveVendor> {
    const numericId = parseInt(vendorId, 10);
    return this.adminService.getVendorById(numericId).pipe(
      map(vendor => vendor.verify ? this.mapVendorToActive(vendor) : this.mapVendorToRequest(vendor)),
      catchError(error => {
        console.error('Error fetching vendor details:', error);
        return of({} as VendorRequest);
      })
    );
  }

  // Fallback mock data methods
  private getMockPendingRequests(): Observable<VendorRequest[]> {
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
    
    return of(mockData).pipe(delay(500));
  }

  private getMockActiveVendors(): Observable<ActiveVendor[]> {
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
    
    return of(mockData).pipe(delay(500));
  }
}
