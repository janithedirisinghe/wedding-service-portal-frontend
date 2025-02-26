import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorService } from '../services/vender.service';
import { Router } from '@angular/router';
import { venderInfo } from '../models/vender.models';

@Component({
  selector: 'app-register-business-info',
  templateUrl: './register-business-info.component.html',
  styleUrl: './register-business-info.component.scss'
})
export class RegisterBusinessInfoComponent implements OnInit{
  bussinesForm!: FormGroup;
  isSubmitting: boolean = false;
  userid: string | null = null;

  // businessName: string = '';
  // location: string = '';
  // vendorType: string = '';
  // registrationNumber: string = '';
  // country: string = '';

  constructor( private fb: FormBuilder,private venderService: VendorService, private router: Router){}

  ngOnInit(): void {
      this.bussinesForm = this.fb.group({
        businessName: ['', [Validators.required, Validators.minLength(3)]],
        location: ['', [Validators.required, Validators.minLength(3)]],
        VenType: ['', [Validators.required, Validators.minLength(3)]],
        brn: ['', [Validators.required, Validators.minLength(3)]],
        country: ['', [Validators.required, Validators.minLength(3)]],
        bio: ['', [Validators.required, Validators.minLength(3)]],
        telNo: ['', [Validators.required, Validators.minLength(3)]]
      })
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
        response.message === 'User registered successfully!'
        localStorage.setItem('vendorId', response.vendorId);
          this.router.navigate(['/vender']);

          console.log('Vendor registered successfully', response);
          this.bussinesForm.reset();
          this.isSubmitting = false;
        
      },
      (error) => {
        console.log('Error: ', error);
        this.isSubmitting = false;
        this.bussinesForm.reset();
      }
    );
  }
  
}
