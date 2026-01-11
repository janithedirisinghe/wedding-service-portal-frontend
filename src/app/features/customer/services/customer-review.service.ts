import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReviewWithVendorDTO {
  reviewId: number;
  rating: number;
  comment: string;
  customerName: string;
  vendorId: number;
  vendorName: string;
  vendorType: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReviewsByCustomerUserId(userId: number): Observable<ReviewWithVendorDTO[]> {
    return this.http.get<ReviewWithVendorDTO[]>(`${this.apiUrl}/api/reviews/customer/${userId}`);
  }
}
