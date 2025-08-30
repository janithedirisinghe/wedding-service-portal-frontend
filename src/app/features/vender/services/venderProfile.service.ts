import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { venderDetails } from "../models/vender.model";
import { VendorStatsDTO } from "../models/vendor-stats.model";

@Injectable({
    providedIn: 'root',
  })
  export class VendorProfileService {

    private apiUrl = 'http://localhost:8080/vendors/'; 

    constructor(private http: HttpClient) {}

   getVendorProfileDetails(userId: number): Observable<venderDetails> {
    return this.http.get<venderDetails>(`${this.apiUrl}getvendor/${userId}`,{
      withCredentials: true
    });
  }

  updateVendorProfile(userId: number, vendorUpdateDTO: venderDetails): Observable<venderDetails> {
    return this.http.put<venderDetails>(`${this.apiUrl}updateprofile/${userId}`, vendorUpdateDTO, {
      withCredentials: true
    });
  }

  /**
   * Update vendor profile with image
   * @param userId - The ID of the vendor to update
   * @param vendorData - The updated vendor data
   * @param profileImage - The profile image file
   * @returns Observable containing updated vendor details
   */
  updateVendorProfileWithImage(userId: number, vendorUpdateDTO: venderDetails, profileImage: File): Observable<venderDetails> {
    const formData = new FormData();
    formData.append('vendor', new Blob([JSON.stringify(vendorUpdateDTO)], { type: 'application/json' }));
    formData.append('profileImage', profileImage);
    
    return this.http.put<venderDetails>(`${this.apiUrl}updateprofile/${userId}`, formData, {
      withCredentials: true
    }); 
  }

  getVendorStats(userId: number): Observable<VendorStatsDTO> {
    return this.http.get<VendorStatsDTO>(`${this.apiUrl}stats/${userId}`, {
      withCredentials: true
    });
  }
}