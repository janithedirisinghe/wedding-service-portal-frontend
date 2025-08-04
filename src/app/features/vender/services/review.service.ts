import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewDTO } from '../models/review.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorReviewService {
  private apiUrl = `${environment.apiUrl}/api/reviews`;

  constructor(private http: HttpClient) {}

  /**
   * Get all reviews for a specific vendor
   * @param vendorId - The ID of the vendor
   * @returns Observable containing array of reviews
   */
  getReviewsByVendorId(vendorId: number): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.apiUrl}/vendor/${vendorId}`, {
      withCredentials: true
    });
  }
}
