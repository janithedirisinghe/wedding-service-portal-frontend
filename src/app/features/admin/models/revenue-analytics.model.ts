export interface RevenueAnalyticsDTO {
  overview: RevenueOverview;
  monthlyTrends: MonthlyTrend[];
  revenueByServiceType: ServiceTypeRevenue[];
  topRevenueVendors: VendorRevenue[];
  paymentAnalytics: PaymentAnalytics;
}

export interface RevenueOverview {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  monthOverMonthGrowth: number;
  yearOverYearGrowth: number;
  averageTransactionValue: number;
  projectedMonthlyRevenue: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  transactionCount: number;
  averageValue: number;
  growthRate: number;
}

export interface ServiceTypeRevenue {
  serviceType: string;
  revenue: number;
  bookingCount: number;
  averageValue: number;
  percentage: number;
}

export interface VendorRevenue {
  vendorId: number;
  businessName: string;
  serviceType: string;
  revenue: number;
  bookingCount: number;
  averageRating: number;
}

export interface PaymentAnalytics {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  successRate: number;
  totalFailedAmount: number;
  paymentStatusDistribution: { [key: string]: number };
}
