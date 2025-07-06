import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService, CustomerInfo } from '../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-customer-complete-info',
  templateUrl: './customer-complete-info.component.html',
  styleUrl: './customer-complete-info.component.scss'
})
export class CustomerCompleteInfoComponent implements OnInit {
  customerInfoForm!: FormGroup;
  isSubmitting: boolean = false;
  vendorTypes: string[] = [
    'Photographer',
    'Videographer',
    'Florist',
    'Caterer',
    'DJ/Music',
    'Decorator',
    'Venue',
    'Makeup Artist',
    'Wedding Planner',
    'Transportation'
  ];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
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

  onVendorTypeChange(vendorType: string, event: any) {
    const preferredTypes = this.customerInfoForm.get('preferredVendorTypes')?.value || [];
    
    if (event.target.checked) {
      if (!preferredTypes.includes(vendorType)) {
        preferredTypes.push(vendorType);
      }
    } else {
      const index = preferredTypes.indexOf(vendorType);
      if (index > -1) {
        preferredTypes.splice(index, 1);
      }
    }
    
    this.customerInfoForm.patchValue({
      preferredVendorTypes: preferredTypes
    });
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
