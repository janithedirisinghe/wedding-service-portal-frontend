import { Component } from '@angular/core';

@Component({
  selector: 'app-register-business-info',
  templateUrl: './register-business-info.component.html',
  styleUrl: './register-business-info.component.scss'
})
export class RegisterBusinessInfoComponent {
  businessName: string = '';
  location: string = '';
  vendorType: string = '';
  registrationNumber: string = '';
  country: string = '';
  
  onSubmit() {
    // Logic to submit business info and navigate to next step
  }
}
