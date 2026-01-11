import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewModel, CreateReviewRequest } from '../models/review.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/api/reviews`;

  constructor(private http: HttpClient) {} 

  /**
   * Get all reviews for a specific vendor
   * @param vendorId - The ID of the vendor
   * @returns Observable containing array of reviews
   */
  getReviewsByVendorId(vendorId: number): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.apiUrl}/vendor/${vendorId}`, {
      withCredentials: true
    });
  }

  getReviewsByVendorIdVendorId(vendorId: number): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.apiUrl}/vendorId/${vendorId}`, {
      withCredentials: true
    });
  }

  /**
   * Get all reviews by a specific customer
   * @param customerId - The ID of the customer
   * @returns Observable containing array of reviews
   */
  getReviewsByCustomerId(customerId: number): Observable<ReviewModel[]> {
    return this.http.get<ReviewModel[]>(`${this.apiUrl}/customer/${customerId}`, {
      withCredentials: true
    });
  }

  /**
   * Create a new review
   * @param review - The review data to create
   * @returns Observable containing the created review
   */
  createReview(review: CreateReviewRequest): Observable<ReviewModel> {
    return this.http.post<ReviewModel>(`${this.apiUrl}`, review, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Update an existing review
   * @param reviewId - The ID of the review to update
   * @param review - The updated review data
   * @returns Observable containing the updated review
   */
  updateReview(reviewId: number, review: Partial<ReviewModel>): Observable<ReviewModel> {
    return this.http.put<ReviewModel>(`${this.apiUrl}/${reviewId}`, review, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Delete a review
   * @param reviewId - The ID of the review to delete
   * @returns Observable<void>
   */
  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reviewId}`, {
      withCredentials: true
    });
  }

  /**
   * Get a specific review by ID
   * @param reviewId - The ID of the review
   * @returns Observable containing the review
   */
  getReviewById(reviewId: number): Observable<ReviewModel> {
    return this.http.get<ReviewModel>(`${this.apiUrl}/${reviewId}`, {
      withCredentials: true
    });
  }

  /**
   * Get average rating for a vendor
   * @param vendorId - The ID of the vendor
   * @returns Observable containing the average rating
   */
  getVendorAverageRating(vendorId: number): Observable<{ averageRating: number; totalReviews: number }> {
    return this.http.get<{ averageRating: number; totalReviews: number }>(`${this.apiUrl}/vendor/${vendorId}/average`, {
      withCredentials: true
    });
  }
}
