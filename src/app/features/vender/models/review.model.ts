export interface ReviewDTO {
  reviewId?: number;
  rating: number;
  comment: string;
  customerId: number;
  customerName: string;
  vendorId: number;
  createdAt: Date;
}
