import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ServiceModel } from "../models/service.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VenderService {
    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient){}

    createService(Service: ServiceModel): Observable<any> {
        return this.http.post<ServiceModel>(`${this.baseUrl}/services`, Service, {
        });
    }

    getServicesByVenderId(venderId: number): Observable<any>{
      return this.http.get<ServiceModel[]>(`${this.baseUrl}/services/getServiceByVendorId/${venderId}`);
    }
}