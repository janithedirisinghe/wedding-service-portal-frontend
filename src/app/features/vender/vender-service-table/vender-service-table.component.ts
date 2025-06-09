import { Component, OnInit } from '@angular/core';
import { VenderService } from '../services/service.service';
import { ServiceByVendor, ServiceModel } from '../models/service.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vender-service-table',
  templateUrl: './vender-service-table.component.html',
  styleUrl: './vender-service-table.component.scss'
})
export class VenderServiceTableComponent implements OnInit {
  venderServiceDetails: ServiceByVendor[] = [];
  
  // Dummy data array
  dummyServiceData: ServiceByVendor[] = [
    {
      serviceId: 1,
      name: 'Wedding Photography',
      description: 'Professional photography service for weddings including pre-wedding shoots, ceremony coverage, and edited digital photos.',
      pricing: 1500,
      vendorId: 4
    },
    {
      serviceId: 2,
      name: 'Catering Service',
      description: 'Delicious food and beverage service for your special day. Multiple cuisine options and custom menus available.',
      pricing: 2500,
      vendorId: 4
    },
    {
      serviceId: 3,
      name: 'Venue Decoration',
      description: 'Beautiful decorations for wedding venue with flower arrangements, lighting, and thematic designs.',
      pricing: 1200,
      vendorId: 4
    }
  ];

  constructor(private venderService: VenderService, private router: Router) {}

  ngOnInit(): void {
    this.getServiceDetailsByVendorId(4);
  }

  getServiceDetailsByVendorId(vendorId: number) {
    // Using dummy data instead of API call
    this.venderServiceDetails = this.dummyServiceData.filter(service => service.vendorId === vendorId);
    
    // Commenting out the API call for now
    // this.venderService.getServicesByVenderId(vendorId).subscribe((data: ServiceByVendor[]) => {
    //   this.venderServiceDetails = data;
    // });
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
    // Future implementation: Navigate to service details page
    // this.router.navigate(['/vender/services', serviceId]);
  }

  // Edit service
  editService(serviceId?: number): void {
    console.log(`Editing service with ID: ${serviceId}`);
    // Future implementation: Navigate to edit service page with the service ID
    // this.router.navigate(['/vender/services/edit', serviceId]);
  }

  // Delete service
  deleteService(serviceId?: number): void {
    if (serviceId) {
      console.log(`Deleting service with ID: ${serviceId}`);
      // Implement confirmation dialog and deletion logic
      
      // For now, let's just filter out the service from the array
      // this.venderServiceDetails = this.venderServiceDetails.filter(service => service.serviceId !== serviceId);
    }
  }

  // Add new service
  addNewService(): void {
    this.router.navigate(['/vender/createService']);
  }

}
