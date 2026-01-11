import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotPasswordService, ForgotPasswordRequest, ResetPasswordRequest } from '../services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  emailForm!: FormGroup;
  resetForm!: FormGroup;
  currentStep: number = 1;
  userType: string = 'customer'; // Default to customer, can be 'admin', 'customer', or 'vendor'
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  userEmail: string = ''; // Store email for step 2

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private forgotPasswordService: ForgotPasswordService
  ) {}

  ngOnInit(): void {
    // Get user type from query parameters
    this.route.queryParams.subscribe(params => {
      if (params['type'] && ['admin', 'customer', 'vendor'].includes(params['type'])) {
        this.userType = params['type'];
      }
    });

    this.initializeForms();
  }

  initializeForms(): void {
    // Email form for step 1
    this.emailForm = this.formBuilder.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]]
    });

    // Reset password form for step 2
    this.resetForm = this.formBuilder.group({
      otp: ['', [
        Validators.required, 
        Validators.pattern(/^\d{6}$/),
        Validators.minLength(6),
        Validators.maxLength(6)
      ]],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).*$/) // At least one letter and one number
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('newPassword');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors?.['passwordMismatch'];
      if (Object.keys(confirmPassword.errors || {}).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  onEmailSubmit(): void {
    if (this.emailForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const request: ForgotPasswordRequest = {
        email: this.emailForm.value.email
      };

      this.forgotPasswordService.sendOtp(request).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.userEmail = this.emailForm.value.email;
            this.successMessage = response.message || 'OTP sent successfully to your email!';
            this.currentStep = 2;
          } else {
            this.errorMessage = response.message || 'Failed to send OTP. Please try again.';
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error sending OTP:', error);
          this.errorMessage = error.message || 'Failed to send OTP. Please try again.';
        }
      });
    }
  }

  onResetSubmit(): void {
    if (this.resetForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const request: ResetPasswordRequest = {
        email: this.userEmail,
        otp: this.resetForm.value.otp,
        newPassword: this.resetForm.value.newPassword,
        confirmPassword: this.resetForm.value.confirmPassword
      };

      this.forgotPasswordService.resetPassword(request).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.successMessage = response.message || 'Password reset successfully!';
            
            // Redirect to appropriate login page after 2 seconds
            setTimeout(() => {
              this.redirectToLogin();
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to reset password. Please try again.';
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error resetting password:', error);
          this.errorMessage = error.message || 'Failed to reset password. Please try again.';
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goBackToEmailStep(): void {
    this.currentStep = 1;
    this.errorMessage = '';
    this.successMessage = '';
    this.userEmail = '';
  }

  redirectToLogin(): void {
    switch (this.userType) {
      case 'admin':
        this.router.navigate(['/auth/admin-login']);
        break;
      case 'vendor':
        this.router.navigate(['/auth/vender-login']);
        break;
      default:
        this.router.navigate(['/auth/customer-login']);
        break;
    }
  }

  getUserTypeDisplay(): string {
    return this.userType.charAt(0).toUpperCase() + this.userType.slice(1);
  }
}
