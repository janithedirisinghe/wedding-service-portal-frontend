import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TimelinePostDTO, TimelineFilter, TimelineType } from '../models/timeline.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  /**
   * Get timeline feed for a customer
   * @param filter - Timeline filter options
   * @returns Observable containing timeline posts
   */
  getTimelineFeed(filter: TimelineFilter = {}): Observable<TimelinePostDTO[]> {
    let params = new HttpParams();
    
    if (filter.customerId) {
      params = params.set('userId', filter.customerId.toString());
    }
    if (filter.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.size !== undefined) {
      params = params.set('size', filter.size.toString());
    }

    return this.http.get<TimelinePostDTO[]>(`${this.apiUrl}/timeline`, {
      params,
      withCredentials: true
    });
  }

  /**
   * Get random posts for explore feed
   * @param filter - Timeline filter options
   * @returns Observable containing random timeline posts
   */
  getRandomPosts(filter: TimelineFilter = {}): Observable<TimelinePostDTO[]> {
    let params = new HttpParams();
    
    if (filter.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.size !== undefined) {
      params = params.set('size', filter.size.toString());
    }

    return this.http.get<TimelinePostDTO[]>(`${this.apiUrl}/timeline/random`, {
      params,
      withCredentials: true
    });
  }

  /**
   * Get posts from followed vendors
   * @param customerId - Customer ID
   * @param filter - Timeline filter options
   * @returns Observable containing followed vendors' posts
   */
  getFollowedVendorsPosts(customerId: number, filter: TimelineFilter = {}): Observable<TimelinePostDTO[]> {
    let params = new HttpParams();
    
    if (filter.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.size !== undefined) {
      params = params.set('size', filter.size.toString());
    }

    return this.http.get<TimelinePostDTO[]>(`${this.apiUrl}/timeline/following/${customerId}`, {
      params,
      withCredentials: true
    });
  }

  /**
   * Get recent posts
   * @param filter - Timeline filter options
   * @returns Observable containing recent timeline posts
   */
  getRecentPosts(filter: TimelineFilter = {}): Observable<TimelinePostDTO[]> {
    let params = new HttpParams();
    
    if (filter.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.size !== undefined) {
      params = params.set('size', filter.size.toString());
    }

    return this.http.get<TimelinePostDTO[]>(`${this.apiUrl}/timeline/recent`, {
      params,
      withCredentials: true
    });
  }

  /**
   * Get explore posts (random posts with larger page size)
   * @param filter - Timeline filter options
   * @returns Observable containing explore timeline posts
   */
  getExplorePosts(filter: TimelineFilter = {}): Observable<TimelinePostDTO[]> {
    let params = new HttpParams();
    
    if (filter.page !== undefined) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.size !== undefined) {
      params = params.set('size', filter.size.toString());
    }

    return this.http.get<TimelinePostDTO[]>(`${this.apiUrl}/timeline/explore`, {
      params,
      withCredentials: true
    });
  }

  /**
   * Get posts based on timeline type
   * @param type - Timeline type
   * @param filter - Timeline filter options
   * @param customerId - Customer ID (required for following type)
   * @returns Observable containing timeline posts
   */
  getPostsByType(type: TimelineType, filter: TimelineFilter = {}, customerId?: number): Observable<TimelinePostDTO[]> {
    switch (type) {
      case TimelineType.GENERAL:
        return this.getTimelineFeed(filter);
      case TimelineType.FOLLOWING:
        if (!customerId) {
          throw new Error('Customer ID is required for following posts');
        }
        return this.getFollowedVendorsPosts(customerId, filter);
      case TimelineType.RECENT:
        return this.getRecentPosts(filter);
      case TimelineType.EXPLORE:
        return this.getExplorePosts(filter);
      case TimelineType.RANDOM:
        return this.getRandomPosts(filter);
      default:
        return this.getTimelineFeed(filter);
    }
  }
}
