import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Vendor {
  venderId: number;
  businessName: string;
  availability: string;
  location: string;
  BRN: string;
  country: string;
  venType: string;
  bio: string;
  telNo: string;
  profileImageUrl: string;
  isActive: boolean;
  verify: boolean;
  services?: Service[];
  followers?: any[];
}

export interface Service {
  serviceId: number;
  serviceName: string;
  description: string;
  price: number;
  pricingModel: string;
  duration: string;
  isActive: boolean;
}

export interface SearchFilters {
  businessName?: string;
  venType?: string;
  location?: string;
  country?: string;
  availability?: string;
  isActive?: boolean;
  verify?: boolean;
}

export interface PriceRangeFilter {
  minPrice: number;
  maxPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class VendorSearchService {
  private apiUrl = `${environment.apiUrl}/vendors`;

  constructor(private http: HttpClient) {}

  // ================= BASIC SEARCH APIs =================
  
  searchByBusinessName(businessName: string): Observable<Vendor[]> {
    const params = new HttpParams().set('businessName', businessName);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/business-name`, { params });
  }

  searchByVendorType(venType: string): Observable<Vendor[]> {
    const params = new HttpParams().set('venType', venType);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/vendor-type`, { params });
  }

  searchByLocation(location: string): Observable<Vendor[]> {
    const params = new HttpParams().set('location', location);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/location`, { params });
  }

  searchByCountry(country: string): Observable<Vendor[]> {
    const params = new HttpParams().set('country', country);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/country`, { params });
  }

  searchByAvailability(availability: string): Observable<Vendor[]> {
    const params = new HttpParams().set('availability', availability);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/availability`, { params });
  }

  // ================= STATUS-BASED SEARCH APIs =================
  
  getActiveVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/active`);
  }

  getVerifiedVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/verified`);
  }

  getActiveAndVerifiedVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/active-verified`);
  }

  // ================= ADVANCED SEARCH APIs =================
  
  searchByTypeAndLocation(venType: string, location: string): Observable<Vendor[]> {
    const params = new HttpParams()
      .set('venType', venType)
      .set('location', location);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/type-location`, { params });
  }

  searchByLocationAndCountry(location: string, country: string): Observable<Vendor[]> {
    const params = new HttpParams()
      .set('location', location)
      .set('country', country);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/location-country`, { params });
  }

  searchByTypeAndCountry(venType: string, country: string): Observable<Vendor[]> {
    const params = new HttpParams()
      .set('venType', venType)
      .set('country', country);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/type-country`, { params });
  }

  // ================= VERIFIED VENDOR SEARCH APIs =================
  
  searchVerifiedVendorsByType(venType: string): Observable<Vendor[]> {
    const params = new HttpParams().set('venType', venType);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/verified/vendor-type`, { params });
  }

  searchVerifiedVendorsByLocation(location: string): Observable<Vendor[]> {
    const params = new HttpParams().set('location', location);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/verified/location`, { params });
  }

  searchVerifiedVendorsByCountry(country: string): Observable<Vendor[]> {
    const params = new HttpParams().set('country', country);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/verified/country`, { params });
  }

  // ================= BIO/DESCRIPTION SEARCH APIs =================
  
  searchByBio(keyword: string): Observable<Vendor[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/bio`, { params });
  }

  searchVerifiedVendorsByBio(keyword: string): Observable<Vendor[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/verified/bio`, { params });
  }

  // ================= MULTI-CRITERIA SEARCH API =================
  
  searchVendors(filters: SearchFilters): Observable<Vendor[]> {
    let params = new HttpParams();
    
    if (filters.businessName) {
      params = params.set('businessName', filters.businessName);
    }
    if (filters.venType) {
      params = params.set('venType', filters.venType);
    }
    if (filters.location) {
      params = params.set('location', filters.location);
    }
    if (filters.country) {
      params = params.set('country', filters.country);
    }
    if (filters.availability) {
      params = params.set('availability', filters.availability);
    }
    if (filters.isActive !== undefined) {
      params = params.set('isActive', filters.isActive.toString());
    }
    if (filters.verify !== undefined) {
      params = params.set('verify', filters.verify.toString());
    }

    return this.http.get<Vendor[]>(`${this.apiUrl}/search/advanced`, { params });
  }

  // ================= SERVICE-BASED SEARCH APIs =================
  
  searchByServiceName(serviceName: string): Observable<Vendor[]> {
    const params = new HttpParams().set('serviceName', serviceName);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/service-name`, { params });
  }

  searchByServicePriceRange(minPrice: number, maxPrice: number): Observable<Vendor[]> {
    const params = new HttpParams()
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/service-price-range`, { params });
  }

  searchByServicePricingModel(pricingModel: string): Observable<Vendor[]> {
    const params = new HttpParams().set('pricingModel', pricingModel);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/service-pricing-model`, { params });
  }

  // ================= FOLLOWER-BASED SEARCH APIs =================
  
  getVendorsWithMinimumFollowers(minFollowers: number): Observable<Vendor[]> {
    const params = new HttpParams().set('minFollowers', minFollowers.toString());
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/minimum-followers`, { params });
  }

  getMostFollowedVendors(limit: number = 10): Observable<Vendor[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/most-followed`, { params });
  }

  // ================= AUTO-COMPLETE SEARCH APIs =================
  
  getBusinessNameSuggestions(query: string, limit: number = 5): Observable<string[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('limit', limit.toString());
    return this.http.get<string[]>(`${this.apiUrl}/search/suggestions/business-name`, { params });
  }

  getVenTypeSuggestions(query: string, limit: number = 5): Observable<string[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('limit', limit.toString());
    return this.http.get<string[]>(`${this.apiUrl}/search/suggestions/vendor-type`, { params });
  }

  getLocationSuggestions(query: string, limit: number = 5): Observable<string[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('limit', limit.toString());
    return this.http.get<string[]>(`${this.apiUrl}/search/suggestions/location`, { params });
  }

  // ================= QUICK SEARCH API =================
  
  quickSearch(query: string): Observable<Vendor[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Vendor[]>(`${this.apiUrl}/search/quick`, { params });
  }

  // ================= FILTER OPTIONS APIs =================
  
  getAllVendorTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/search/vendor-types`);
  }

  getAllCountries(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/search/countries`);
  }

  // ================= UTILITY METHODS =================
  
  /**
   * Get vendor follower count from the followers array
   */
  getFollowerCount(vendor: Vendor): number {
    return vendor.followers ? vendor.followers.length : 0;
  }

  /**
   * Get vendor average rating (you might need to implement this based on your rating system)
   */
  getAverageRating(vendor: Vendor): number {
    // This would need to be implemented based on your rating/review system
    // For now, returning a placeholder
    return 0;
  }

  /**
   * Get vendor starting price from services
   */
  getStartingPrice(vendor: Vendor): number {
    if (!vendor.services || vendor.services.length === 0) {
      return 0;
    }
    
    const prices = vendor.services
      .filter(service => service.isActive)
      .map(service => service.price);
    
    return prices.length > 0 ? Math.min(...prices) : 0;
  }
}
