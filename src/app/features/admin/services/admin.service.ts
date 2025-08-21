import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Vendor } from '../../../shared/Models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  /**
   * Get all vendors from the admin endpoint
   * @returns Observable<Vendor[]>
   */
  getAllVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors`, {
      withCredentials: true
    });
  }

  /**
   * Get active vendors (where isActive = true)
   * @returns Observable<Vendor[]>
   */
  getActiveVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors/active`, {
      withCredentials: true
    }); 
  }

  /**
   * Get pending vendor verification requests (where verify = false)
   * @returns Observable<Vendor[]>
   */
  getPendingVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors/pending`, {
      withCredentials: true
    });
  }

  /**
   * Approve a vendor (set verify = true)
   * @param vendorId - The ID of the vendor to approve
   * @returns Observable<Vendor>
   */
  approveVendor(vendorId: number): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/vendors/${vendorId}/verify?verify=true`, {}, {
      withCredentials: true
    });
  }

  /**
   * Reject/Disapprove a vendor (set verify = false)
   * @param vendorId - The ID of the vendor to reject
   * @returns Observable<Vendor>
   */
  rejectVendor(vendorId: number): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/vendors/${vendorId}/verify?verify=false`, {}, {
      withCredentials: true
    });
  }

  /**
   * Deactivate a vendor (set isActive = false)
   * @param vendorId - The ID of the vendor to deactivate
   * @returns Observable<Vendor>
   */
  deactivateVendor(vendorId: number): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/vendors/${vendorId}/status`, { isActive: false }, {
      withCredentials: true
    });
  } 

  /**
   * Toggle vendor active status
   * @param vendorId - The ID of the vendor
   * @param isActive - The new active status
   * @returns Observable<any>
   */
  toggleVendorStatus(vendorId: number, isActive: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/vendors/${vendorId}/status`, { isActive }, {
      withCredentials: true
    });
  }

  /**
   * Get vendor by ID
   * @param vendorId - The ID of the vendor
   * @returns Observable<Vendor>
   */
  getVendorById(vendorId: number): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/vendors/${vendorId}`, {
      withCredentials: true
    });
  }
}
