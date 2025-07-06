import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FollowRequest, FollowResponse } from '../models/follow.model';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = `${environment.apiUrl}/api/followers`;

  constructor(private http: HttpClient) {}

  /**
   * Follow a vendor
   * @param customerId - Customer ID
   * @param vendorId - Vendor ID to follow
   * @returns Observable containing follow response
   */
  followVendor(userId: number, vendorId: number): Observable<FollowResponse> {
    const followRequest: FollowRequest = {
      userId,
      vendorId
    };

    return this.http.post<FollowResponse>(`${this.apiUrl}/follow`, followRequest, {
      withCredentials: true
    });
  }

  /**
   * Unfollow a vendor
   * @param customerId - Customer ID
   * @param vendorId - Vendor ID to unfollow
   * @returns Observable containing unfollow response
   */
  unfollowVendor(userId: number, vendorId: number): Observable<FollowResponse> {
    const followRequest: FollowRequest = {
      userId,
      vendorId
    };

    return this.http.post<FollowResponse>(`${this.apiUrl}/unfollow`, followRequest, {
      withCredentials: true
    });
  }

  /**
   * Toggle follow status for a vendor
   * @param customerId - Customer ID
   * @param vendorId - Vendor ID
   * @param isCurrentlyFollowing - Current follow status
   * @returns Observable containing response
   */
  toggleFollow(customerId: number, vendorId: number, isCurrentlyFollowing: boolean): Observable<FollowResponse> {
    if (isCurrentlyFollowing) {
      return this.unfollowVendor(customerId, vendorId);
    } else {
      return this.followVendor(customerId, vendorId);
    }
  }

  /**
   * Check if customer is following specific vendors
   * @param customerId - Customer ID
   * @param vendorIds - Array of vendor IDs to check
   * @returns Observable containing follow status for each vendor
   */
  checkFollowStatus(customerId: number, vendorIds: number[]): Observable<{[vendorId: number]: boolean}> {
    const params = new HttpParams()
      .set('customerId', customerId.toString())
      .set('vendorIds', vendorIds.join(','));

    return this.http.get<{[vendorId: number]: boolean}>(`${this.apiUrl}/status`, {
      params,
      withCredentials: true
    });
  }

  /**
   * Get all vendors followed by a customer
   * @param customerId - Customer ID
   * @returns Observable containing array of followed vendor IDs
   */
  getFollowedVendors(customerId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/customer/${customerId}/following`, {
      withCredentials: true
    });
  }
}
