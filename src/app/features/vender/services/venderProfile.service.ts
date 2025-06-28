import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { venderDetails } from "../models/vender.model";

@Injectable({
    providedIn: 'root',
  })
  export class VendorProfileService {

    private apiUrl = 'http://localhost:8080/vendors/'; 

    constructor(private http: HttpClient) {}

   getVendorProfileDetails(vendorId: number): Observable<venderDetails> {
    return this.http.get<venderDetails>(`${this.apiUrl}getvendor/${vendorId}`,{
      withCredentials: true
    });
  }
  }