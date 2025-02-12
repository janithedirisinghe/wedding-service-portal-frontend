import { Component } from '@angular/core';

@Component({
  selector: 'app-register-vender-info',
  templateUrl: './register-vender-info.component.html',
  styleUrl: './register-vender-info.component.scss'
})
export class RegisterVenderInfoComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  
  onSubmit() {
    // Logic to submit user info and navigate to next step
  }
}
