import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { DashboardStatsDTO, OverviewStats, RevenueStats, BookingStats, VendorStats, CustomerStats, RecentActivityDTO } from '../models/dashboard-stats.model';
import { AdminAnalyticsDTO } from '../models/admin-analytics.model';
import { RevenueAnalyticsDTO } from '../models/revenue-analytics.model';
import { BookingAnalyticsDTO } from '../models/booking-analytics.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  
  // Data properties
  dashboardStats: DashboardStatsDTO | null = null;
  detailedAnalytics: AdminAnalyticsDTO | null = null;
  revenueAnalytics: RevenueStats | null = null;
  bookingAnalytics: BookingStats | null = null;
  vendorAnalytics: VendorStats | null = null;
  customerAnalytics: CustomerStats | null = null;
  platformOverview: OverviewStats | null = null;
  recentActivities: RecentActivityDTO[] = [];
  detailedRevenueAnalytics: RevenueAnalyticsDTO | null = null;
  detailedBookingAnalytics: BookingAnalyticsDTO | null = null;
  kpiData: { [key: string]: any } | null = null;
  dashboardWidgets: { [key: string]: any } | null = null;
  
  // Loading states
  loading = {
    dashboardStats: false,
    detailedAnalytics: false,
    revenueAnalytics: false,
    bookingAnalytics: false,
    vendorAnalytics: false,
    customerAnalytics: false,
    platformOverview: false,
    recentActivities: false,
    detailedRevenueAnalytics: false,
    detailedBookingAnalytics: false,
    kpiData: false,
    dashboardWidgets: false
  };

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadAllAnalytics();
  }

  loadAllAnalytics(): void {
    this.loadDashboardStats();
    this.loadDetailedAnalytics();
    this.loadRevenueAnalytics();
    this.loadBookingAnalytics();
    this.loadVendorAnalytics();
    this.loadCustomerAnalytics();
    this.loadPlatformOverview();
    this.loadRecentActivities();
    this.loadDetailedRevenueAnalytics();
    this.loadDetailedBookingAnalytics();
    this.loadKPIData();
    this.loadDashboardWidgets();
  }

  loadDashboardStats(): void {
    this.loading.dashboardStats = true;
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.dashboardStats = data;
        this.loading.dashboardStats = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.loading.dashboardStats = false;
      }
    });
  }

  loadDetailedAnalytics(): void {
    this.loading.detailedAnalytics = true;
    this.adminService.getDetailedAnalytics().subscribe({
      next: (data) => {
        this.detailedAnalytics = data;
        this.loading.detailedAnalytics = false;
      },
      error: (error) => {
        console.error('Error loading detailed analytics:', error);
        this.loading.detailedAnalytics = false;
      }
    });
  }

  loadRevenueAnalytics(): void {
    this.loading.revenueAnalytics = true;
    this.adminService.getRevenueAnalytics().subscribe({
      next: (data) => {
        this.revenueAnalytics = data;
        this.loading.revenueAnalytics = false;
      },
      error: (error) => {
        console.error('Error loading revenue analytics:', error);
        this.loading.revenueAnalytics = false;
      }
    });
  }

  loadBookingAnalytics(): void {
    this.loading.bookingAnalytics = true;
    this.adminService.getBookingAnalytics().subscribe({
      next: (data) => {
        this.bookingAnalytics = data;
        this.loading.bookingAnalytics = false;
      },
      error: (error) => {
        console.error('Error loading booking analytics:', error);
        this.loading.bookingAnalytics = false;
      }
    });
  }

  loadVendorAnalytics(): void {
    this.loading.vendorAnalytics = true;
    this.adminService.getVendorAnalytics().subscribe({
      next: (data) => {
        this.vendorAnalytics = data;
        this.loading.vendorAnalytics = false;
      },
      error: (error) => {
        console.error('Error loading vendor analytics:', error);
        this.loading.vendorAnalytics = false;
      }
    });
  }

  loadCustomerAnalytics(): void {
    this.loading.customerAnalytics = true;
    this.adminService.getCustomerAnalytics().subscribe({
      next: (data) => {
        this.customerAnalytics = data;
        this.loading.customerAnalytics = false;
      },
      error: (error) => {
        console.error('Error loading customer analytics:', error);
        this.loading.customerAnalytics = false;
      }
    });
  }

  loadPlatformOverview(): void {
    this.loading.platformOverview = true;
    this.adminService.getPlatformOverview().subscribe({
      next: (data) => {
        this.platformOverview = data;
        this.loading.platformOverview = false;
      },
      error: (error) => {
        console.error('Error loading platform overview:', error);
        this.loading.platformOverview = false;
      }
    });
  }

  loadRecentActivities(): void {
    this.loading.recentActivities = true;
    this.adminService.getRecentActivities().subscribe({
      next: (data) => {
        this.recentActivities = data;
        this.loading.recentActivities = false;
      },
      error: (error) => {
        console.error('Error loading recent activities:', error);
        this.loading.recentActivities = false;
      }
    });
  }

  loadDetailedRevenueAnalytics(): void {
    this.loading.detailedRevenueAnalytics = true;
    this.adminService.getDetailedRevenueAnalytics().subscribe({
      next: (data) => {
        this.detailedRevenueAnalytics = data;
        this.loading.detailedRevenueAnalytics = false;
      },
      error: (error) => {
        console.error('Error loading detailed revenue analytics:', error);
        this.loading.detailedRevenueAnalytics = false;
      }
    });
  }

  loadDetailedBookingAnalytics(): void {
    this.loading.detailedBookingAnalytics = true;
    this.adminService.getDetailedBookingAnalytics().subscribe({
      next: (data) => {
        this.detailedBookingAnalytics = data;
        this.loading.detailedBookingAnalytics = false;
      },
      error: (error) => {
        console.error('Error loading detailed booking analytics:', error);
        this.loading.detailedBookingAnalytics = false;
      }
    });
  }

  loadKPIData(): void {
    this.loading.kpiData = true;
    this.adminService.getKeyPerformanceIndicators().subscribe({
      next: (data) => {
        this.kpiData = data;
        this.loading.kpiData = false;
      },
      error: (error) => {
        console.error('Error loading KPI data:', error);
        this.loading.kpiData = false;
      }
    });
  }

  loadDashboardWidgets(): void {
    this.loading.dashboardWidgets = true;
    this.adminService.getDashboardWidgets().subscribe({
      next: (data) => {
        this.dashboardWidgets = data;
        this.loading.dashboardWidgets = false;
      },
      error: (error) => {
        console.error('Error loading dashboard widgets:', error);
        this.loading.dashboardWidgets = false;
      }
    });
  }

  // Helper methods for displaying data
  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') {
      if (value % 1 === 0) return value.toString();
      return value.toFixed(2);
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value.toString();
  }
}
