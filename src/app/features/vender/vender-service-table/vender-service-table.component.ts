import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selectedService: ServiceByVendor | null = null;
  showDetailsModal: boolean = false;
  loadingDetails: boolean = false;
  detailsError: string | null = null;

  editForm!: FormGroup;
  showEditModal: boolean = false;
  savingEdit: boolean = false;
  editError: string | null = null;
  constructor(private venderService: VenderService, private router: Router, private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const userId = Number(this.authService.getUserId());
        this.getServiceDetailsByVendorId(userId);
  this.buildEditForm();
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
  // Ensure edit modal is closed before showing details
  this.showEditModal = false;
    const found = this.venderServiceDetails.find(s => s.serviceId === serviceId);
    if (!found) {
      this.detailsError = 'Service not found in current list';
      this.showDetailsModal = true;
      return;
    }
    this.selectedService = found;
    this.detailsError = null;
    this.showDetailsModal = true;
    this.loadingDetails = false; // no async fetch
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedService = null;
  }

  // Edit service
  editService(serviceId?: number): void {
  if(!serviceId) return;
  // Ensure details modal closed when editing
  this.showDetailsModal = false;
  const found = this.venderServiceDetails.find(s => s.serviceId === serviceId);
  if(!found) return;
  this.selectedService = found;
  this.patchEditForm(found);
  this.editError = null;
  this.showEditModal = true;
  }

  // Delete service
  deleteService(serviceId?: number): void {
    if (!serviceId) return;
    const idx = this.venderServiceDetails.findIndex(s => s.serviceId === serviceId);
    if (idx === -1) return;
 
    // Optimistic removal
    const removed = this.venderServiceDetails[idx];
    this.venderServiceDetails.splice(idx, 1);

    this.venderService.deleteService(serviceId).subscribe({
      next: () => {
        // If the deleted item was being viewed/edited, close modals
        if (this.selectedService && this.selectedService.serviceId === serviceId) {
          this.closeDetailsModal();
          this.closeEditModal();
        }
      },
      error: (err) => {
        console.error('Delete failed', err);
        // Rollback UI
        this.venderServiceDetails.splice(idx, 0, removed);
        // Optionally surface an error (could wire a toast service)
        alert(err?.error?.message || 'Failed to delete service');
      }
    });
  }

  // Add new service
  addNewService(): void {
    this.router.navigate(['/vender/createService']);
  }

  buildEditForm() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      pricing: [null, [Validators.required, Validators.min(0)]],
      pricingModel: ['FIXED', [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      advancePercentage: [null, [Validators.min(0), Validators.max(100)]],
      discountPercent: [null, [Validators.min(0), Validators.max(100)]],
      bookBeforeDays: [null, [Validators.min(0)]],
      isAvailable: [true],
      serviceAreaType: ['LOCAL', [Validators.required]],
      cancellationPolicy: ['']
    });
  }

  patchEditForm(service: ServiceByVendor) {
    this.editForm.patchValue({
      name: service.name,
      description: service.description,
      pricing: service.pricing,
      pricingModel: service.pricingModel || 'FIXED',
      status: service.status || 'ACTIVE',
      advancePercentage: service.advancePercentage ?? null,
      discountPercent: service.discountPercent ?? null,
      bookBeforeDays: service.bookBeforeDays ?? null,
      isAvailable: service.isAvailable ?? true,
      serviceAreaType: service.serviceAreaType || 'LOCAL',
      cancellationPolicy: service.cancellationPolicy || ''
    });
  }

  saveEdit() {
    if(!this.selectedService || this.editForm.invalid || this.savingEdit) return;
    this.savingEdit = true;
    const userId = Number(this.authService.getUserId());
    const formVal = this.editForm.value;
    const payload: ServiceModel = {
      name: formVal.name,
      description: formVal.description,
      pricing: Number(formVal.pricing),
      userId: userId,
      pricingModel: formVal.pricingModel,
      status: formVal.status,
      advancePercentage: formVal.advancePercentage !== null ? Number(formVal.advancePercentage) : null,
      discountPercent: formVal.discountPercent !== null ? Number(formVal.discountPercent) : null,
      bookBeforeDays: formVal.bookBeforeDays !== null ? Number(formVal.bookBeforeDays) : null,
      isAvailable: formVal.isAvailable,
      serviceAreaType: formVal.serviceAreaType,
      cancellationPolicy: formVal.cancellationPolicy
    };
    this.venderService.updateService(this.selectedService.serviceId, payload).subscribe({
      next: (updated) => {
        const idx = this.venderServiceDetails.findIndex(s => s.serviceId === this.selectedService!.serviceId);
        if(idx > -1) {
          // Merge backend updated fields
            this.venderServiceDetails[idx] = { ...this.venderServiceDetails[idx], ...updated };
        }
        this.savingEdit = false;
        this.showEditModal = false;
        this.selectedService = null;
      },
      error: (err) => {
        console.error('Update failed', err);
        this.editError = err?.error?.message || 'Failed to update service';
        this.savingEdit = false;
      }
    });
  }

  closeEditModal() {
    this.showEditModal = false;
    // preserve selectedService only if details modal currently open
    if(!this.showDetailsModal) {
      this.selectedService = null;
    }
    this.editForm.reset();
  }

}
