import { Component } from '@angular/core';

@Component({
  selector: 'app-vender-register',
  templateUrl: './vender-register.component.html',
  styleUrl: './vender-register.component.scss'
})
export class VenderRegisterComponent {
  currentStep: number = 1
;

  goToNextStep() {
    this.currentStep++;
  }
}
