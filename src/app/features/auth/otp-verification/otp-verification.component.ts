import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OTP } from '../models/vender.models';
import { VendorService } from '../services/vender.service';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent implements OnInit {
  otp: string = '';
  otpForm!: FormGroup;
  isSubmitting: boolean = false;
  emaill: string = '';
  @Output() otpCompleted = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private venderService: VendorService, private toastr: ToastrService){} // Inject ToastrService
  ngOnInit(): void {
      this.otpForm = this.fb.group({
        otp: ['', [Validators.required, Validators.minLength(6)]]
      })
  }
  onSubmit() {
    // Logic to verify OTP
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const formValues = this.otpForm.value;

    const otpData: OTP = {
      ...formValues
    }

    this.emaill = localStorage.getItem('email') || '';

    otpData.email = this.emaill;

    // Call the API to verify OTP
    this.venderService.verifyOTP(otpData).subscribe(
      (response: any) => {
        console.log('OTP verified successfully', response);
        setTimeout(() => {
        this.toastr.success('OTP verified successfully'); // Show success message
        }
        , 1000);
        this.otpForm.reset();
        this.otpCompleted.emit();
        this.isSubmitting = false;
      },
      (error: any) => {
        console.error('Error verifying OTP', error);
        setTimeout(() => {
        this.toastr.error('Error verifying OTP'); // Show error message
        }
        , 1000);
        this.isSubmitting = false;
        this.otpForm.reset();
      }
    );
  }
}
