import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface VendorType {
  vendorTypeId?: number;
  vendorTypeName: string;
  description?: string;
  createdDate?: Date;
  updatedDate?: Date;
  isActive: boolean;
}

export interface VendorTypeResponse {
  data: VendorType[];
  total: number; 
  page: number;
  limit: number;
}

export interface VendorTypeFilters {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VendorTypeService {
  private apiUrl = `${environment.apiUrl}/api/vendor-types`;

  constructor(private http: HttpClient) { }

  /**
   * Get all vendor types
   */
  getVendorTypes(filters?: VendorTypeFilters): Observable<VendorType[]> {
    return this.http.get<VendorType[]>(this.apiUrl, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get a single vendor type by ID
   */
  getVendorTypeById(id: number): Observable<VendorType> {
    return this.http.get<VendorType>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create a new vendor type
   */
  createVendorType(vendorType: Partial<VendorType>): Observable<VendorType> {
    const createData = {
      vendorTypeName: vendorType.vendorTypeName,
      description: vendorType.description,
      isActive: vendorType.isActive ?? true
    };

    return this.http.post<VendorType>(this.apiUrl, createData, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing vendor type
   */
  updateVendorType(id: number, vendorType: Partial<VendorType>): Observable<VendorType> {
    const updateData = {
      vendorTypeName: vendorType.vendorTypeName,
      description: vendorType.description,
      isActive: vendorType.isActive
    };

    return this.http.put<VendorType>(`${this.apiUrl}/${id}`, updateData, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Delete a vendor type (soft delete - deactivate)
   */
  deleteVendorType(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/deactivate`, {}, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Activate vendor type
   */
  activateVendorType(id: number): Observable<VendorType> {
    return this.http.put<VendorType>(`${this.apiUrl}/${id}/activate`, {}, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Deactivate vendor type
   */
  deactivateVendorType(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}/deactivate`, {}, {
      withCredentials: true,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Toggle vendor type status (active/inactive)
   */
  toggleVendorTypeStatus(id: number, isActive: boolean): Observable<VendorType | { message: string }> {
    if (isActive) {
      return this.activateVendorType(id);
    } else {
      return this.deactivateVendorType(id) as Observable<any>;
    }
  }

  /**
   * Get vendor types for dropdown/select options (active only)
   */
  getActiveVendorTypes(): Observable<VendorType[]> {
    return this.http.get<VendorType[]>(`${this.apiUrl}/active`, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('VendorTypeService Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.error) {
        errorMessage = error.error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => ({
      ...error,
      userMessage: errorMessage
    }));
  }
}
