import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-customer-toolbar',
  templateUrl: './customer-toolbar.component.html',
  styleUrl: './customer-toolbar.component.scss'
})
export class CustomerToolbarComponent implements OnInit {
  activeTab: string = 'timeline';
  unreadMessages: number = 0; // This would come from a service in real app

  constructor(private router: Router) {}
  ngOnInit() {
    // Listen to route changes to update active tab
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updateActiveTab(event.url);
      });

    // Set initial active tab
    this.updateActiveTab(this.router.url);

    // Simulate unread messages (in real app, this would come from a chat service)
    this.unreadMessages = 3;
  }

  private updateActiveTab(url: string) {
    if (url.includes('/timeline')) {
      this.activeTab = 'timeline';
    } else if (url.includes('/chat')) {
      this.activeTab = 'chat';
    } else if (url.includes('/customer-profile')) {
      this.activeTab = 'profile';
    } else if (url.includes('/favorites')) {
      this.activeTab = 'favorites';
    } else {
      this.activeTab = 'timeline'; // default
    }
  }

  navigateToTimeline() {
    this.router.navigate(['/customer/timeline']);
  }

  navigateToFavorites() {
    // Navigate to favorites/wishlist page (you may need to add this route)
    console.log('Favorites functionality - route to be implemented');
    // this.router.navigate(['/customer/favorites']);
  }

  navigateToSearch() {
    // Navigate to search page or open search modal
    console.log('Search functionality - route to be implemented');
    // this.router.navigate(['/customer/search']);
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
    // Reset unread messages when user opens chat
    this.unreadMessages = 0;
  }
}
