import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.component.html',
  styleUrl: './customer-register.component.scss'
})
export class CustomerRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting: boolean = false; // Prevent multiple submissions

  constructor(private fb: FormBuilder, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registerCustomer(event?: Event) {
   
    // if (this.registerForm.invalid) {
    //   // this.toastr.error('Please fill out all required fields correctly.', 'Form Validation Error');
    //   return;
    // }
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const formValues = this.registerForm.value;

    const registrationData: Customer= {
      ...formValues
    }
    
  this.customerService.registerCustomer(registrationData).subscribe(
    (res: any) => {
      
      const response = { message: res }; // If res is a string, wrap it in a JSON object
      console.log('Customer registered successfully', response);
      this.registerForm.reset();
      this.isSubmitting = false;
    },
    (error: any) => {
      console.error('Error registering customer', error);
      this.registerForm.reset();
    }
  );
}
}
