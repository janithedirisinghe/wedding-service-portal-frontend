import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbartwo',
  templateUrl: './navbartwo.component.html',
  styleUrl: './navbartwo.component.scss'
})
export class NavbartwoComponent implements OnInit {
  searchQuery: string = '';
  showNotifications: boolean = false;
  showProfileDropdown: boolean = false;
  unreadNotifications: number = 3;
  
  // User data
  userName: string = '';
  userRole: string = '';
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit() {
    this.loadUserData();
    
    // Listen for route changes to refresh user data
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUserData();
    });
    
    // Refresh data every 10 seconds to catch login state changes
    setInterval(() => {
      this.loadUserData();
    }, 10000);
  }  loadUserData() {
    try {
      // Get user data through AuthService which handles storage fallbacks
      const username = this.authService.getUserName();
      const userRole = this.authService.getUserRole();
        this.userName = username || 'Guest User';
      this.userRole = this.formatRole(userRole || '');
    } catch (error) {
      // Silent error handling
      this.userName = 'Guest User';
      this.userRole = 'User';
    }
  }

  formatRole(role: string): string {
    switch(role.toUpperCase()) {
      case 'VENDOR': return 'Wedding Vendor';
      case 'CUSTOMER': return 'Customer';
      case 'ADMIN': return 'Administrator';
      default: return 'User';
    }
  }
  
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfileDropdown = false; // Close profile dropdown
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
    this.showNotifications = false; // Close notifications dropdown
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  viewProfile() {
    this.showProfileDropdown = false;
    // Navigate to profile page based on role
    const role = this.authService.getUserRole()?.toLowerCase();
    switch(role) {
      case 'vendor':
        this.router.navigate(['/vender/profile']);
        break;
      case 'customer':
        this.router.navigate(['/customer/profile']);
        break;
      case 'admin':
        this.router.navigate(['/admin/profile']);
        break;
      default:
        this.router.navigate(['/profile']);
    }
  }

  viewSettings() {
    this.showProfileDropdown = false;
    this.router.navigate(['/settings']);
  }
  // Close dropdowns when clicking outside
  closeDropdowns() {
    this.showNotifications = false;
    this.showProfileDropdown = false;
  }

  // Method to manually refresh user data (can be called after login)
  refreshUserData() {
    this.loadUserData();
  }
}
