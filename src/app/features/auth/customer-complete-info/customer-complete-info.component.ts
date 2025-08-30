import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService, CustomerInfo } from '../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { VendorTypeService, VendorType } from '../../admin/services/vendor-type.service';

@Component({
  selector: 'app-customer-complete-info',
  templateUrl: './customer-complete-info.component.html',
  styleUrl: './customer-complete-info.component.scss'
})
export class CustomerCompleteInfoComponent implements OnInit {
  customerInfoForm!: FormGroup;
  isSubmitting: boolean = false;
  vendorTypes: VendorType[] = [];
  loadingVendorTypes: boolean = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private vendorTypeService: VendorTypeService
  ) {}

  ngOnInit(): void {
    this.loadVendorTypes();
    this.customerInfoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(2)]],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      preferredVendorTypes: [[], [Validators.required]],
      weddingDate: [''],
      budget: ['']
    });
  }

  loadVendorTypes(): void {
    this.loadingVendorTypes = true;
    this.vendorTypeService.getActiveVendorTypes().subscribe({
      next: (vendorTypes: VendorType[]) => {
        this.vendorTypes = vendorTypes;
        this.loadingVendorTypes = false;
        console.log('Loaded vendor types:', vendorTypes);
      },
      error: (error) => {
        console.error('Error loading vendor types:', error);
        this.loadingVendorTypes = false;
        // Fallback to hardcoded options if API fails
        this.vendorTypes = [
          { vendorTypeName: 'Photographer', isActive: true },
          { vendorTypeName: 'Videographer', isActive: true },
          { vendorTypeName: 'Florist', isActive: true },
          { vendorTypeName: 'Caterer', isActive: true },
          { vendorTypeName: 'DJ/Music', isActive: true },
          { vendorTypeName: 'Decorator', isActive: true },
          { vendorTypeName: 'Venue', isActive: true },
          { vendorTypeName: 'Makeup Artist', isActive: true },
          { vendorTypeName: 'Wedding Planner', isActive: true },
          { vendorTypeName: 'Transportation', isActive: true }
        ];
        this.toastr.warning('Failed to load vendor types from server. Using default options.');
      }
    });
  }

  onVendorTypeChange(vendorType: VendorType, event: any) {
    const preferredTypes = this.customerInfoForm.get('preferredVendorTypes')?.value || [];
    
    if (event.target.checked) {
      if (!preferredTypes.includes(vendorType.vendorTypeName)) {
        preferredTypes.push(vendorType.vendorTypeName);
      }
    } else {
      const index = preferredTypes.indexOf(vendorType.vendorTypeName);
      if (index > -1) {
        preferredTypes.splice(index, 1);
      }
    }
    
    this.customerInfoForm.patchValue({
      preferredVendorTypes: preferredTypes
    });
  }

  isVendorTypeSelected(vendorType: VendorType): boolean {
    const selectedTypes = this.customerInfoForm.get('preferredVendorTypes')?.value || [];
    return selectedTypes.includes(vendorType.vendorTypeName);
  }

  onSubmit() {
    if (this.customerInfoForm.invalid) {
      this.toastr.error('Please fill out all required fields correctly.', 'Form Validation Error');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.spinner.show();

    const formData = this.customerInfoForm.value;
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User ID not found in localStorage');
      this.toastr.error('User session expired. Please register again.', 'Error');
      this.isSubmitting = false;
      this.spinner.hide();
      return;
    }

    const customerInfo: CustomerInfo = { ...formData };

    this.customerService.postCustomerDetails(customerInfo, userId).subscribe(
      (response: any) => {
        if (response.message === 'User registered successfully!') {
          localStorage.setItem('customerId', response.customerId);
          localStorage.removeItem('userId'); // Clean up temporary userId
          localStorage.removeItem('email'); // Clean up temporary email
          this.router.navigate(['/customer']);
          setTimeout(() => {
            this.toastr.success('Customer profile completed successfully!', 'Success');
          }, 1000);
          this.customerInfoForm.reset();
        }
        this.isSubmitting = false;
        this.spinner.hide();
      },
      (error: any) => {
        console.error('Error: ', error);
        setTimeout(() => {
          this.toastr.error('Error completing customer profile. Please try again.', 'Error');
        }, 1000);
        this.isSubmitting = false;
        this.spinner.hide();
        this.customerInfoForm.reset();
      }
    );
  }
}
