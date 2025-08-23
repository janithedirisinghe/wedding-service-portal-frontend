import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Vendor } from '../../../shared/Models/vendor.model';
import { DashboardStatsDTO, OverviewStats, RevenueStats, BookingStats, VendorStats, CustomerStats, RecentActivityDTO } from '../models/dashboard-stats.model';
import { AdminAnalyticsDTO } from '../models/admin-analytics.model';
import { RevenueAnalyticsDTO } from '../models/revenue-analytics.model';
import { BookingAnalyticsDTO } from '../models/booking-analytics.model';

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

  // Analytics Endpoints

  /**
   * Get dashboard statistics
   * @returns Observable<DashboardStatsDTO>
   */
  getDashboardStats(): Observable<DashboardStatsDTO> {
    return this.http.get<DashboardStatsDTO>(`${this.apiUrl}/analytics/dashboard`, {
      withCredentials: true
    });
  }

  /**
   * Get detailed analytics
   * @returns Observable<AdminAnalyticsDTO>
   */
  getDetailedAnalytics(): Observable<AdminAnalyticsDTO> {
    return this.http.get<AdminAnalyticsDTO>(`${this.apiUrl}/analytics/detailed`, {
      withCredentials: true
    });
  }

  /**
   * Get revenue analytics overview
   * @returns Observable<RevenueStats>
   */
  getRevenueAnalytics(): Observable<RevenueStats> {
    return this.http.get<RevenueStats>(`${this.apiUrl}/analytics/revenue`, {
      withCredentials: true
    });
  }

  /**
   * Get booking analytics overview
   * @returns Observable<BookingStats>
   */
  getBookingAnalytics(): Observable<BookingStats> {
    return this.http.get<BookingStats>(`${this.apiUrl}/analytics/bookings`, {
      withCredentials: true
    });
  }

  /**
   * Get vendor analytics overview
   * @returns Observable<VendorStats>
   */
  getVendorAnalytics(): Observable<VendorStats> {
    return this.http.get<VendorStats>(`${this.apiUrl}/analytics/vendors`, {
      withCredentials: true
    });
  }

  /**
   * Get customer analytics overview
   * @returns Observable<CustomerStats>
   */
  getCustomerAnalytics(): Observable<CustomerStats> {
    return this.http.get<CustomerStats>(`${this.apiUrl}/analytics/customers`, {
      withCredentials: true
    });
  }

  /**
   * Get platform overview metrics
   * @returns Observable<OverviewStats>
   */
  getPlatformOverview(): Observable<OverviewStats> {
    return this.http.get<OverviewStats>(`${this.apiUrl}/analytics/platform-overview`, {
      withCredentials: true
    });
  }

  /**
   * Get recent platform activities
   * @returns Observable<RecentActivityDTO[]>
   */
  getRecentActivities(): Observable<RecentActivityDTO[]> {
    return this.http.get<RecentActivityDTO[]>(`${this.apiUrl}/analytics/recent-activities`, {
      withCredentials: true
    });
  }

  /**
   * Get comprehensive revenue analytics with trends and breakdowns
   * @returns Observable<RevenueAnalyticsDTO>
   */
  getDetailedRevenueAnalytics(): Observable<RevenueAnalyticsDTO> {
    return this.http.get<RevenueAnalyticsDTO>(`${this.apiUrl}/analytics/revenue/detailed`, {
      withCredentials: true
    });
  }

  /**
   * Get comprehensive booking analytics with trends and performance metrics
   * @returns Observable<BookingAnalyticsDTO>
   */
  getDetailedBookingAnalytics(): Observable<BookingAnalyticsDTO> {
    return this.http.get<BookingAnalyticsDTO>(`${this.apiUrl}/analytics/bookings/detailed`, {
      withCredentials: true
    });
  }

  /**
   * Get key performance indicators for the platform
   * @returns Observable<any>
   */
  getKeyPerformanceIndicators(): Observable<{ [key: string]: any }> {
    return this.http.get<{ [key: string]: any }>(`${this.apiUrl}/analytics/kpi`, {
      withCredentials: true
    });
  }

  /**
   * Get analytics summary for dashboard widgets
   * @returns Observable<any>
   */
  getDashboardWidgets(): Observable<{ [key: string]: any }> {
    return this.http.get<{ [key: string]: any }>(`${this.apiUrl}/analytics/widgets`, {
      withCredentials: true
    });
  }
}
