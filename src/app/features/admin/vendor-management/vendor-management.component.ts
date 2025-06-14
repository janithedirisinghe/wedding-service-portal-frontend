import { Component, OnInit } from '@angular/core';
import { VendorManagementService, VendorRequest, ActiveVendor } from '../services/vendor-management.service';

@Component({
  selector: 'app-vendor-management',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.scss']
})
export class VendorManagementComponent implements OnInit {
  vendorRequests: VendorRequest[] = [];
  activeVendors: ActiveVendor[] = [];
  showActiveVendors = false;
  isLoading = false;

  constructor(private vendorService: VendorManagementService) { }

  ngOnInit(): void {
    this.loadVendorRequests();
  }

  loadVendorRequests(): void {
    this.isLoading = true;
    this.vendorService.getPendingVendorRequests().subscribe({
      next: (requests) => {
        this.vendorRequests = requests;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vendor requests:', error);
        this.isLoading = false;
      }
    });
  }

  loadActiveVendors(): void {
    this.isLoading = true;
    this.showActiveVendors = true;
    this.vendorService.getActiveVendors().subscribe({
      next: (vendors) => {
        this.activeVendors = vendors;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading active vendors:', error);
        this.isLoading = false;
      }
    });
  }

  showPendingRequests(): void {
    this.showActiveVendors = false;
    this.loadVendorRequests();
  }

  approveVendor(vendorId: string): void {
    const vendor = this.vendorRequests.find(v => v.id === vendorId);
    if (vendor) {
      vendor.status = 'approved';
      
      this.vendorService.approveVendor(vendorId).subscribe({
        next: (response) => {
          console.log('Vendor approved:', response);
          // Remove from pending requests after approval
          setTimeout(() => {
            this.vendorRequests = this.vendorRequests.filter(v => v.id !== vendorId);
          }, 1000);
        },
        error: (error) => {
          console.error('Error approving vendor:', error);
          // Revert status change on error
          vendor.status = 'pending';
        }
      });
    }
  }

  rejectVendor(vendorId: string): void {
    const vendor = this.vendorRequests.find(v => v.id === vendorId);
    if (vendor) {
      vendor.status = 'rejected';
      
      this.vendorService.rejectVendor(vendorId).subscribe({
        next: (response) => {
          console.log('Vendor rejected:', response);
          // Remove from pending requests after rejection
          setTimeout(() => {
            this.vendorRequests = this.vendorRequests.filter(v => v.id !== vendorId);
          }, 1000);
        },
        error: (error) => {
          console.error('Error rejecting vendor:', error);
          // Revert status change on error
          vendor.status = 'pending';
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }
}
