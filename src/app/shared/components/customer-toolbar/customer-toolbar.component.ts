import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-toolbar',
  templateUrl: './customer-toolbar.component.html',
  styleUrl: './customer-toolbar.component.scss'
})
export class CustomerToolbarComponent {

  constructor(private router: Router) {}

  navigateToTimeline() {
    this.router.navigate(['/customer/timeline']);
  }

  navigateToWallet() {
    // Placeholder for wallet functionality - route not defined in routing module
    console.log('Wallet functionality not implemented yet');
  }

  navigateToAddNew() {
    // Placeholder for add new functionality - could be for creating new posts/requests
    console.log('Add new functionality not implemented yet');
  }

  navigateToVenderProfile() {
    this.router.navigate(['/customer/vender-profile']);
  }

  navigateToCustomerProfile() {
    this.router.navigate(['/customer/customer-profile']);
  }

  navigateToChat() {
    this.router.navigate(['/customer/chat']);
  }
}
