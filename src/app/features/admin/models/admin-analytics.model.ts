export interface AdminAnalyticsDTO {
  platformMetrics: PlatformMetrics;
  performanceMetrics: PerformanceMetrics;
  financialMetrics: FinancialMetrics;
}

export interface PlatformMetrics {
  totalUsers: number;
  monthlyActiveUsers: number;
  dailyActiveUsers: number;
  userGrowthRate: number;
  platformUtilizationRate: number;
  totalTransactions: number;
  lastUpdated: Date;
}

export interface PerformanceMetrics {
  averageBookingResponseTime: number; // in hours
  customerSatisfactionScore: number;
  vendorSatisfactionScore: number;
  disputeResolutionCount: number;
  bookingSuccessRate: number;
  paymentSuccessRate: number;
}

export interface FinancialMetrics {
  totalPlatformRevenue: number;
  averageTransactionValue: number;
  monthlyRecurringRevenue: number;
  projectedAnnualRevenue: number;
  revenuePerCustomer: number;
  revenuePerVendor: number;
}
