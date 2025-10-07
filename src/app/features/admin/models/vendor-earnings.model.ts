export interface VendorRevenue {
  vendorId: number;
  vendorName: string;
  totalRevenue: number;
  totalPayments: number;
}

export interface VendorRevenueResponse {
  data: VendorRevenue[];
}
