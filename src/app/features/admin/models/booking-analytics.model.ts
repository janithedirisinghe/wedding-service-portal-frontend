export interface BookingAnalyticsDTO {
  overview: BookingOverview;
  dailyTrends: BookingTrend[];
  monthlyTrends: BookingTrend[];
  serviceTypeStats: { [key: string]: BookingServiceStats };
  topVendorsByBookings: VendorBookingStats[];
  performance: BookingPerformanceMetrics;
}

export interface BookingOverview {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  cancellationRate: number;
  averageResponseTime: number; // in hours
}

export interface BookingTrend {
  period: string; // date or month
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export interface BookingServiceStats {
  serviceType: string;
  totalBookings: number;
  completedBookings: number;
  completionRate: number;
  averageRating: number;
  uniqueCustomers: number;
  activeVendors: number;
}

export interface VendorBookingStats {
  vendorId: number;
  businessName: string;
  serviceType: string;
  totalBookings: number;
  completedBookings: number;
  completionRate: number;
  averageResponseTime: number;
  averageRating: number;
  location: string;
}

export interface BookingPerformanceMetrics {
  averageBookingValue: number;
  peakBookingHour: number;
  mostPopularServiceType: string;
  mostActiveDay: string;
  repeatCustomers: number;
  customerRetentionRate: number;
  lastUpdated: Date;
}
