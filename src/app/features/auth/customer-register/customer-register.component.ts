import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.scss'
})
export class CustomerRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  otpForm!: FormGroup;
  isSubmitting: boolean = false; // Prevent multiple submissions
  currentStep: number = 1; // 1 for registration, 2 for OTP verification

  constructor(
    private fb: FormBuilder, 
    private customerService: CustomerService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      terms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Passwords should match validator
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  // Go to next step
  goToNextStep() {
    this.currentStep++;
  }

  // Handle registration completion
  onRegistrationComplete() {
    this.goToNextStep();
  }

  // Handle OTP verification completion
  onOtpVerificationComplete() {
    this.router.navigate(['/auth/customer-complete-info']);
  }

  registerCustomer(event?: Event) {
    if (this.registerForm.invalid) {
      this.toastr.error('Please fill out all required fields correctly.', 'Form Validation Error');
      return;
    }
    
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.spinner.show();

    const formValues = this.registerForm.value;
    const registrationData: Customer = {
      ...formValues,
      role: 'CUSTOMER'
    };

    this.customerService.registerCustomer(registrationData).subscribe(
      (response: any) => {
        if (response.message === 'User registered successfully!') {
          // Store userId and email in localStorage for OTP verification
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('email', formValues.email);
          this.registerForm.reset();
          this.onRegistrationComplete();
          setTimeout(() => {
            this.toastr.success('Registration successful! OTP sent to your email', 'Success');
          }, 100);
          this.spinner.hide();
          this.isSubmitting = false;
        }
      },
      (error: any) => {
        console.error('Error registering customer', error);
        setTimeout(() => {
          this.toastr.error('Registration failed. Please try again. Username or Email already used', 'Error');
        }, 100);
        this.registerForm.reset();
        this.spinner.hide();
        this.isSubmitting = false;
      }
    );
  }

  // Handle OTP verification
  verifyOTP() {
    if (this.otpForm.invalid) {
      this.toastr.error('Please enter a valid OTP', 'Validation Error');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.spinner.show();

    const otpValue = this.otpForm.value.otp;
    const email = localStorage.getItem('email') || '';

    const otpData = {
      otp: otpValue,
      email: email
    };

    this.customerService.verifyOTP(otpData).subscribe(
      (response: any) => {
        console.log('OTP verified successfully', response);
        setTimeout(() => {
          this.toastr.success('OTP verified successfully', 'Success');
        }, 100);
        this.otpForm.reset();
        this.onOtpVerificationComplete();
        this.spinner.hide();
        this.isSubmitting = false;
      },
      (error: any) => {
        console.error('Error verifying OTP', error);
        setTimeout(() => {
          this.toastr.error('Invalid OTP. Please try again', 'Error');
        }, 100);
        this.otpForm.reset();
        this.spinner.hide();
        this.isSubmitting = false;
      }
    );
  }
}
