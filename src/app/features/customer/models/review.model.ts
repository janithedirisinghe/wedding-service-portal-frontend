export interface ReviewModel {
  reviewId?: number;
  rating: number;
  comment: string;
  customerId: number | null;
  vendorId: number;
  createdAt?: string;
}

export interface ReviewDTO {
  reviewId?: number;
  rating: number;
  comment: string;
  customerId: number | null;
  vendorId: number;
  createdAt?: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
  vendorId: number;
  customerId: number;
}
