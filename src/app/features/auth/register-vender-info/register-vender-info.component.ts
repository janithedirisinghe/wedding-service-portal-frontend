import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';
import { CustomerService } from '../services/customer.service';
import { Vender } from '../models/vender.models';
import { VendorService } from '../services/vender.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register-vender-info',
  templateUrl: './register-vender-info.component.html',
  styleUrl: './register-vender-info.component.scss'
})
export class RegisterVenderInfoComponent implements OnInit {
  userForm!: FormGroup;
  isSubmitting: boolean = false; 

  @Output() registrationCompleted = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
    this.spinner.hide();
  }

  // Passwords should match
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  // Submit the form and handle the registration process
  onSubmit() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.spinner.show();
 
      const formData = this.userForm.value;
      const formvalues : Vender= {
        ...formData
      }

      formvalues.role = "VENDOR";
      this.vendorService.registerVender(formvalues).subscribe(
        (response: any) => {
          if (response.message === 'User registered successfully!') {
            // Store userId and email in localStorage for the next step (OTP verification)
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('email', formData.email);
            this.userForm.reset();
            // Navigate to the OTP verification step
            // this.router.navigate(['/otp-verification']);
            this.registrationCompleted.emit();
            setTimeout(() => {
              this.toastr.success('Registration successful! and send otp to the Email', 'Success');
            }, 100);
            this.spinner.hide();
            this.isSubmitting = false;
          }
        },
        (error: any) => {
          // Handle error if registration fails
          console.error('Registration failed', error);
          setTimeout(() => {
          this.toastr.error('Registration failed. Please try again. User name or Email already Used', 'Error');
        }, 100);
          this.userForm.reset();
          this.spinner.hide();
          this.isSubmitting = false;
        }
      );
  }
}
