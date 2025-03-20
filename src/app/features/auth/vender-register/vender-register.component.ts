import { Component } from '@angular/core';

@Component({
  selector: 'app-vender-register',
  templateUrl: './vender-register.component.html',
  styleUrl: './vender-register.component.scss'
})
export class VenderRegisterComponent {
  currentStep: number = 1;

  goToNextStep() {
    this.currentStep++;
  }

  onRegistrationComplete() {
    // When registration is complete, go to the OTP verification step
    this.goToNextStep();
  }

  onOtpVerificationComplete() {
    // When OTP verification is complete, go to the login page
    this.goToNextStep();
  }
}
