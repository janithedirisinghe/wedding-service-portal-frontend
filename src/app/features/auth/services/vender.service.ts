import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { OTP, Vender, venderInfo } from "../models/vender.models";

@Injectable({
  providedIn: 'root'
})
export class VendorService {
    private apiUrl = 'http://localhost:8080/auth'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  registerVender(vender: Vender): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, vender);
  }

  verifyOTP(otp: OTP): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-otp`,  otp );
  }

  postVenderDetails(venderInfo: venderInfo, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/vendor-complete-info?userId=${userId}`, venderInfo);
  }
  
}