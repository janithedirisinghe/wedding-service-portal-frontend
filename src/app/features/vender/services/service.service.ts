import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ServiceModel, VenderProfile } from "../models/service.model";
import { Observable } from "rxjs";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VenderService {
  private baseUrl = environment.apiUrl;

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

    updateService(serviceId: number, service: ServiceModel): Observable<ServiceModel> {
      // Backend expects path variable id + DTO body; exclude serviceId duplication unless required
      const payload: ServiceModel = {
        name: service.name,
        description: service.description,
        pricing: service.pricing,
        userId: service.userId, // include if backend uses for auth/ownership validation
        status: service.status,
        pricingModel: service.pricingModel,
        advancePercentage: service.advancePercentage ?? null,
        discountPercent: service.discountPercent ?? null,
        bookBeforeDays: service.bookBeforeDays ?? null,
        isAvailable: service.isAvailable,
        serviceAreaType: service.serviceAreaType,
        cancellationPolicy: service.cancellationPolicy
      };
      return this.http.put<ServiceModel>(`${this.baseUrl}/services/${serviceId}`, payload, { withCredentials: true });
    }

    deleteService(serviceId: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/services/${serviceId}`, { withCredentials: true });
    }

}