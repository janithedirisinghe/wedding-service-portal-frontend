import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Login } from '../../../shared/Models/login.model';

@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.scss'
})
export class CustomerLoginComponent implements OnInit {
  customerLoginForm!: FormGroup;
  isSubmitting: boolean = false;

  constructor(
    private loginService: AuthService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.customerLoginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.spinner.hide();
  }

  onSubmit() {
    if (this.customerLoginForm.invalid) {
      this.toaster.error('Please fill out all fields correctly', 'Form Validation Error');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.spinner.show();

    const formData = this.customerLoginForm.value;
    const loginData: Login = {
      ...formData
    };

    this.loginService.login(loginData).subscribe(
      (response: any) => {
        if (response.role === 'CUSTOMER') {
          setTimeout(() => {
            this.toaster.success('Login Successful', 'Welcome!');
          }, 500);
          this.customerLoginForm.reset();
          this.spinner.hide();
          this.isSubmitting = false;
        } else {
          setTimeout(() => {
            this.toaster.error('Invalid credentials for customer login', 'Login Failed');
          }, 500);
          this.spinner.hide();
          this.isSubmitting = false;
        }
      },
      (error: any) => {
        console.error('Login error:', error);
        setTimeout(() => {
          this.toaster.error('Login Failed. Please check your credentials.', 'Error');
        }, 500);
        this.spinner.hide();
        this.isSubmitting = false;
      }
    );
  }
}
