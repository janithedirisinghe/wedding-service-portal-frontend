import { Component, OnInit } from '@angular/core';
import { VenderService } from '../services/service.service';
import { ServiceByVendor, ServiceModel } from '../models/service.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-vender-service-table',
  templateUrl: './vender-service-table.component.html',
  styleUrl: './vender-service-table.component.scss'
})
export class VenderServiceTableComponent implements OnInit {
  venderServiceDetails: ServiceByVendor[] = [];
  constructor(private venderService: VenderService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = Number(this.authService.getUserId());
        this.getServiceDetailsByVendorId(userId);
  }

  getServiceDetailsByVendorId(vendorId: number) {
    this.venderService.getServicesByVenderId(vendorId).subscribe((data: ServiceByVendor[]) => {
      this.venderServiceDetails = data;
    });
  }

  // Calculate total revenue from all services
  getTotalRevenue(): number {
    if (!this.venderServiceDetails || this.venderServiceDetails.length === 0) {
      return 0;
    }
    return this.venderServiceDetails.reduce((total, service) => total + (service.pricing || 0), 0);
  }

  // View service details
  viewServiceDetails(serviceId: number): void {
    console.log(`Viewing service with ID: ${serviceId}`);
  }

  // Edit service
  editService(serviceId?: number): void {
    console.log(`Editing service with ID: ${serviceId}`);
  }

  // Delete service
  deleteService(serviceId?: number): void {
    if (serviceId) {
      console.log(`Deleting service with ID: ${serviceId}`);
    }
  }

  // Add new service
  addNewService(): void {
    this.router.navigate(['/vender/createService']);
  }

}
