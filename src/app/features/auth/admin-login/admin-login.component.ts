import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Login } from '../../../shared/Models/login.model';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  adminLoginForm!: FormGroup;
  showPassword = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.initializeForm();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  private initializeForm(): void {
    this.adminLoginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    if (this.adminLoginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.spinner.show();

      const formData = this.adminLoginForm.value;
      const loginData: Login = {
        username: formData.username,
        password: formData.password
      };

      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          // Check if the logged in user has admin role
          if (response.role === 'ADMIN') {
            setTimeout(() => {
              this.toastr.success('Admin login successful!');
            }, 500);
            this.adminLoginForm.reset();
          } else {
            // If not admin, logout and show error
            this.authService.logout();
            this.errorMessage = 'Access denied. Admin privileges required.';
            setTimeout(() => {
              this.toastr.error('Access denied. Admin privileges required.');
            }, 500);
          }
          this.spinner.hide();
          this.isSubmitting = false;
        },
        error: (error: any) => {
          console.error('Login error:', error);
          this.errorMessage = 'Invalid username or password. Please try again.';
          setTimeout(() => {
            this.toastr.error('Login failed. Please check your credentials.');
          }, 500);
          this.spinner.hide();
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.adminLoginForm.controls).forEach(key => {
      const control = this.adminLoginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to check if field has error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.adminLoginForm.get(fieldName);
    return !!(field?.errors?.[errorType] && field?.touched);
  }

  // Helper method to get field error message
  getErrorMessage(fieldName: string): string {
    const field = this.adminLoginForm.get(fieldName);
    
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      username: 'Username',
      password: 'Password'
    };
    return displayNames[fieldName] || fieldName;
  }
}
