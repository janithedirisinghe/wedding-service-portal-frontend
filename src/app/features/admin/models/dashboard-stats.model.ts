export interface DashboardStatsDTO {
  overviewStats: OverviewStats;
  revenueStats: RevenueStats;
  bookingStats: BookingStats;
  vendorStats: VendorStats;
  customerStats: CustomerStats;
  recentActivities: RecentActivityDTO[];
}

export interface OverviewStats {
  totalCustomers: number;
  totalVendors: number;
  totalBookings: number;
  totalServices: number;
  totalRevenue: number;
  pendingVerifications: number;
  activeBookings: number;
  averageRating: number;
}

export interface RevenueStats {
  monthlyRevenue: number;
  yearlyRevenue: number;
  previousMonthRevenue: number;
  revenueGrowthRate: number;
  monthlyRevenueChart: MonthlyRevenueData[];
  revenueByServiceType: { [key: string]: number };
}

export interface BookingStats {
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  bookingCompletionRate: number;
  bookingsByStatus: { [key: string]: number };
  dailyBookingsChart: DailyBookingData[];
}

export interface VendorStats {
  totalVendors: number;
  verifiedVendors: number;
  pendingVerifications: number;
  activeVendors: number;
  vendorsByType: { [key: string]: number };
  averageVendorRating: number;
  topPerformingVendors: TopVendorDTO[];
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  customerRetentionRate: number;
  customerGrowthChart: CustomerGrowthData[];
}

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  bookingCount: number;
}

export interface DailyBookingData {
  date: string;
  bookings: number;
}

export interface CustomerGrowthData {
  month: string;
  newCustomers: number;
  totalCustomers: number;
}

export interface TopVendorDTO {
  vendorId: number;
  businessName: string;
  venType: string;
  averageRating: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface RecentActivityDTO {
  type: string; // BOOKING, PAYMENT, VENDOR_REGISTRATION, REVIEW
  description: string;
  timestamp: string;
  userType: string; // CUSTOMER, VENDOR
  userName: string;
}
