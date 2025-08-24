import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ServiceModel, VenderProfile } from "../models/service.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VenderService {
    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient){}

    getVenderProfileDetails(venderId: number): Observable<any> {
      return this.http.get<VenderProfile>(`${this.baseUrl}/vendors/getvendor/${venderId}`,{
      withCredentials: true
    });
    }


    createService(service: ServiceModel): Observable<any> {
        // Map to backend DTO (if naming differences exist adjust here)
        const payload = {
          name: service.name,
          description: service.description,
          pricing: service.pricing,
          userId: service.userId,
          status: service.status,
          pricingModel: service.pricingModel,
            advancePercentage: service.advancePercentage,
            discountPercent: service.discountPercent,
            bookBeforeDays: service.bookBeforeDays,
            isAvailable: service.isAvailable,
            serviceAreaType: service.serviceAreaType,
            cancellationPolicy: service.cancellationPolicy
        };
        return this.http.post(`${this.baseUrl}/services`, payload, {
          withCredentials: true
        });
    }

    getServicesByVenderId(venderId: number): Observable<any>{
      return this.http.get<ServiceModel[]>(`${this.baseUrl}/services/getServiceByUserId/${venderId}`,{
      withCredentials: true
    });
    }

    updateService(serviceId: number, service: ServiceModel): Observable<any> {
      const payload = {
        serviceId: serviceId,
        name: service.name,
        description: service.description,
        pricing: service.pricing,
        userId: service.userId,
        status: service.status,
        pricingModel: service.pricingModel,
        advancePercentage: service.advancePercentage,
        discountPercent: service.discountPercent,
        bookBeforeDays: service.bookBeforeDays,
        isAvailable: service.isAvailable,
        serviceAreaType: service.serviceAreaType,
        cancellationPolicy: service.cancellationPolicy
      };
      return this.http.put(`${this.baseUrl}/services/${serviceId}`, payload, {
        withCredentials: true
      });
    }

}