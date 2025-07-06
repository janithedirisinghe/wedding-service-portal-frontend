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
   * @param userId - User ID (Customer ID)
   * @param vendorId - Vendor ID to follow
   * @returns Observable containing follow response
   */
  followVendor(userId: number, vendorId: number): Observable<FollowResponse> {
    const followRequest: FollowRequest = {
      userId,
      vendorId
    };

    return this.http.post<FollowResponse>(`${this.apiUrl}/follow`, followRequest);
  }

  /**
   * Unfollow a vendor
   * @param userId - User ID (Customer ID)
   * @param vendorId - Vendor ID to unfollow
   * @returns Observable containing unfollow response
   */
  unfollowVendor(userId: number, vendorId: number): Observable<FollowResponse> {
    const followRequest: FollowRequest = {
      userId,
      vendorId
    };

    return this.http.post<FollowResponse>(`${this.apiUrl}/unfollow`, followRequest);
  }

  /**
   * Toggle follow status for a vendor
   * @param userId - User ID (Customer ID)
   * @param vendorId - Vendor ID
   * @param isCurrentlyFollowing - Current follow status
   * @returns Observable containing response
   */
  toggleFollow(userId: number, vendorId: number, isCurrentlyFollowing: boolean): Observable<FollowResponse> {
    if (isCurrentlyFollowing) {
      return this.unfollowVendor(userId, vendorId);
    } else {
      return this.followVendor(userId, vendorId);
    }
  }

  /**
   * Check if user is following a specific vendor
   * @param userId - User ID (Customer ID)
   * @param vendorId - Vendor ID to check
   * @returns Observable containing follow status response
   */
  checkFollowStatus(userId: number, vendorId: number): Observable<{success: boolean, isFollowing: boolean}> {
    return this.http.get<{success: boolean, isFollowing: boolean}>(`${this.apiUrl}/check/${userId}/${vendorId}`);
  }

  /**
   * Check follow status for multiple vendors
   * @param userId - User ID (Customer ID)
   * @param vendorIds - Array of vendor IDs to check
   * @returns Observable containing follow status for each vendor
   */
  checkMultipleFollowStatus(userId: number, vendorIds: number[]): Observable<{[vendorId: number]: boolean}> {
    return new Observable(observer => {
      if (vendorIds.length === 0) {
        observer.next({});
        observer.complete();
        return;
      }

      const followStatus: {[vendorId: number]: boolean} = {};
      let completed = 0;

      vendorIds.forEach(vendorId => {
        this.checkFollowStatus(userId, vendorId).subscribe({
          next: (response) => {
            followStatus[vendorId] = response.success ? response.isFollowing : false;
            completed++;
            
            if (completed === vendorIds.length) {
              observer.next(followStatus);
              observer.complete();
            }
          },
          error: (error) => {
            console.error(`Error checking follow status for vendor ${vendorId}:`, error);
            followStatus[vendorId] = false;
            completed++;
            
            if (completed === vendorIds.length) {
              observer.next(followStatus);
              observer.complete();
            }
          }
        });
      });
    });
  }

  /**
   * Get all vendors followed by a user
   * @param userId - User ID (Customer ID)
   * @returns Observable containing array of followed vendor IDs
   */
  getFollowedVendors(userId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/customer/${userId}/following`);
  }
}
