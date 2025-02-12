import { Component } from '@angular/core';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent {
  otp: string = '';
  
  onSubmit() {
    // Logic to verify OTP
  }
}
