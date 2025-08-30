import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../services/vender.service';
import { Router } from '@angular/router';
import { venderInfo } from '../models/vender.models';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { VendorTypeService, VendorType } from '../../admin/services/vendor-type.service';

@Component({
  selector: 'app-register-business-info',
  templateUrl: './register-business-info.component.html',
  styleUrl: './register-business-info.component.scss'
})
export class RegisterBusinessInfoComponent implements OnInit{
  bussinesForm!: FormGroup;
  isSubmitting: boolean = false;
  userid: string | null = null;
  vendorTypes: VendorType[] = [];
  loadingVendorTypes: boolean = false;

  constructor(
    private fb: FormBuilder,
    private venderService: VendorService,
    private router: Router,
    private toastr: ToastrService, // Inject ToastrService
    private vendorTypeService: VendorTypeService
  ) {}

  ngOnInit(): void {
    this.loadVendorTypes();
    this.bussinesForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      VenType: ['', [Validators.required, Validators.minLength(3)]],
      brn: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', [Validators.required, Validators.minLength(3)]],
      bio: ['', [Validators.required, Validators.minLength(3)]],
      telNo: ['', [Validators.required, Validators.minLength(3)]]
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
          { vendorTypeName: 'Catering', isActive: true },
          { vendorTypeName: 'Venue', isActive: true },
          { vendorTypeName: 'Decoration', isActive: true },
          { vendorTypeName: 'Music/DJ', isActive: true },
          { vendorTypeName: 'Transportation', isActive: true },
          { vendorTypeName: 'Wedding Cake', isActive: true },
          { vendorTypeName: 'Planning Services', isActive: true }
        ];
        this.toastr.warning('Failed to load vendor types from server. Using default options.');
      }
    });
  }

  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const formData = this.bussinesForm.value;
    const userId = localStorage.getItem('userId'); // Get userId from localStorage

    if (!userId) {
      console.error('User ID not found in localStorage');
      this.isSubmitting = false;
      return;
    }

    const formvalues: venderInfo = { ...formData };

    this.venderService.postVenderDetails(formvalues, userId).subscribe(
      (response: any) => {
        if (response.message === 'Vendor registered successfully!') {
          localStorage.setItem('vendorId', response.vendorId);
          this.router.navigate(['auth/vender-login']);
          setTimeout(() => {
            this.toastr.success('Vendor registered successfully'); // Show success message
          }, 1000);
          this.bussinesForm.reset();
        }
        this.isSubmitting = false;
      },
      (error) => {
        console.log('Error: ', error);
        setTimeout(() => {
        this.toastr.error('Error registering vendor'); // Show error message
        }
        , 1000);
        this.isSubmitting = false;
        this.bussinesForm.reset();
      }
    );
  }
}
