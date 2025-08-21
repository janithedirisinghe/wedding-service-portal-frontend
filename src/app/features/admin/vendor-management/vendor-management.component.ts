import { Component, OnInit } from '@angular/core';
import { VendorManagementService, VendorRequest, ActiveVendor } from '../services/vendor-management.service';
import { Vendor, Service } from '../../../shared/Models/vendor.model';

@Component({
  selector: 'app-vendor-management',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.scss']
})
export class VendorManagementComponent implements OnInit {
  vendorRequests: VendorRequest[] = [];
  activeVendors: ActiveVendor[] = [];
  allVendors: Vendor[] = [];
  pendingVendors: Vendor[] = []; // New: pending vendors (verify = false)
  verifiedVendors: Vendor[] = []; // New: verified vendors (verify = true)
  showActiveVendors = false;
  showAllVendors = false;
  showPendingVendors = false; // New: show pending vendors view
  showVerifiedVendors = false; // New: show verified vendors view
  isLoading = false;
  
  // Services popup
  showServicesPopup = false;
  selectedVendorServices: Service[] = [];
  selectedVendorName = '';

  constructor(private vendorService: VendorManagementService) { }

  ngOnInit(): void {
    this.loadPendingVendors(); // Load pending vendors by default
    this.loadAllVendors(); // Load all vendors on component initialization
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
    this.resetViewStates();
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

  loadAllVendors(): void {
    this.isLoading = true;
    this.vendorService.getAllVendors().subscribe({
      next: (vendors) => {
        this.allVendors = vendors;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading all vendors:', error);
        this.isLoading = false;
      }
    });
  }

  showAllVendorsView(): void {
    this.resetViewStates();
    this.showAllVendors = true;
    this.loadAllVendors();
  }

  // New method to load and show pending vendors (verify = false)
  loadPendingVendors(): void {
    this.isLoading = true;
    this.resetViewStates();
    this.showPendingVendors = true;
    
    this.vendorService.getAllVendors().subscribe({
      next: (vendors) => {
        this.pendingVendors = vendors.filter(vendor => !vendor.verify);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pending vendors:', error);
        this.isLoading = false;
      }
    });
  }

  // New method to load and show verified vendors (verify = true)
  loadVerifiedVendors(): void {
    this.isLoading = true;
    this.resetViewStates();
    this.showVerifiedVendors = true;
    
    this.vendorService.getAllVendors().subscribe({
      next: (vendors) => {
        this.verifiedVendors = vendors.filter(vendor => vendor.verify);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading verified vendors:', error);
        this.isLoading = false;
      }
    });
  }

  // Helper method to reset all view states
  private resetViewStates(): void {
    this.showActiveVendors = false;
    this.showAllVendors = false;
    this.showPendingVendors = false;
    this.showVerifiedVendors = false;
  }

  // Helper method to refresh the current view
  private refreshCurrentView(): void {
    if (this.showPendingVendors) {
      this.loadPendingVendors();
    } else if (this.showVerifiedVendors) {
      this.loadVerifiedVendors();
    } else if (this.showActiveVendors) {
      this.loadActiveVendors();
    } else if (this.showAllVendors) {
      this.loadAllVendors();
    } else {
      this.loadVendorRequests();
    }
  }

  showPendingRequests(): void {
    this.resetViewStates();
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
            // Refresh current view
            this.refreshCurrentView();
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

  // New method to approve vendor from pending vendors view
  approveVendorFromPending(vendor: Vendor): void {
    this.vendorService.approveVendor(vendor.venderId.toString()).subscribe({
      next: (response) => {
        console.log('Vendor approved:', response);
        // Remove from pending vendors and refresh view
        setTimeout(() => {
          this.refreshCurrentView();
        }, 1000);
      },
      error: (error) => {
        console.error('Error approving vendor:', error);
      }
    });
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
            this.refreshCurrentView();
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

  // New method to reject vendor from pending vendors view
  rejectVendorFromPending(vendor: Vendor): void {
    this.vendorService.rejectVendor(vendor.venderId.toString()).subscribe({
      next: (response) => {
        console.log('Vendor rejected:', response);
        // Refresh view to remove rejected vendor
        setTimeout(() => {
          this.refreshCurrentView();
        }, 1000);
      },
      error: (error) => {
        console.error('Error rejecting vendor:', error);
      }
    });
  }

  // New method to deactivate vendor (different from rejection)
  deactivateVendor(vendor: Vendor): void {
    this.vendorService.deactivateVendor(vendor.venderId.toString()).subscribe({
      next: (response) => {
        console.log('Vendor deactivated:', response);
        // Refresh view to show updated status
        setTimeout(() => {
          this.refreshCurrentView();
        }, 1000);
      },
      error: (error) => {
        console.error('Error deactivating vendor:', error);
      }
    });
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

  viewVendorDetails(vendorId: number): void {
    console.log('Viewing vendor details for ID:', vendorId);
    // TODO: Implement vendor details view/modal
    // You can navigate to a details page or open a modal
  }

  toggleVendorStatus(vendor: Vendor): void {
    // TODO: Implement status toggle functionality
    console.log('Toggling status for vendor:', vendor.venderId);
  }

  showServices(vendor: Vendor): void {
    this.selectedVendorServices = vendor.services || [];
    this.selectedVendorName = vendor.businessName;
    this.showServicesPopup = true;
  }

  closeServicesPopup(): void {
    this.showServicesPopup = false;
    this.selectedVendorServices = [];
    this.selectedVendorName = '';
  }
}
