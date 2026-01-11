import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar-with-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationDropdownComponent],
  template: `
    <header class="bg-white shadow-md border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          
          <!-- Logo and Navigation -->
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-2xl font-bold text-blue-600">Wed</span>
              <span class="text-2xl font-bold text-gray-800">Ease</span>
            </div>
            
            <!-- Navigation Links -->
            <nav class="hidden md:ml-8 md:flex md:space-x-8">
              <a 
                routerLink="/dashboard" 
                routerLinkActive="text-blue-600 border-blue-600"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
                Dashboard
              </a>
              <a 
                routerLink="/services" 
                routerLinkActive="text-blue-600 border-blue-600"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
                Services
              </a>
              <a 
                routerLink="/bookings" 
                routerLinkActive="text-blue-600 border-blue-600"
                class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
                Bookings
              </a>
            </nav>
          </div>

          <!-- Right side: Search, Notifications, Profile -->
          <div class="flex items-center space-x-4">
            
            <!-- Search -->
            <div class="hidden md:block">
              <div class="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
              </div>
            </div>

            <!-- Notifications -->
            <app-notification-dropdown></app-notification-dropdown>

            <!-- Messages Icon -->
            <button 
              routerLink="/messages"
              class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg transition-colors">
              <i class="fas fa-envelope text-xl"></i>
            </button>

            <!-- Profile Dropdown -->
            <div class="relative">
              <button 
                (click)="toggleProfileMenu()"
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                type="button">
                <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  <img
                    [src]="userAvatar || 'assets/placeholder-vendor.jpg'"
                    [alt]="userName + ' Avatar'"
                    class="w-full h-full object-cover">
                </div>
                <span class="hidden md:block text-sm font-medium text-gray-700">{{ userName }}</span>
                <i class="fas fa-chevron-down text-xs text-gray-500"></i>
              </button>

              <!-- Profile Dropdown Menu -->
              <div 
                *ngIf="isProfileMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div class="py-1">
                  <a 
                    routerLink="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <i class="fas fa-user mr-2"></i>
                    Your Profile
                  </a>
                  <a 
                    routerLink="/settings" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <i class="fas fa-cog mr-2"></i>
                    Settings
                  </a>
                  <hr class="my-1">
                  <button 
                    (click)="logout()" 
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile menu button -->
            <button 
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <i class="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div *ngIf="isMobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <a 
              routerLink="/dashboard" 
              routerLinkActive="bg-blue-100 text-blue-700"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Dashboard
            </a>
            <a 
              routerLink="/services" 
              routerLinkActive="bg-blue-100 text-blue-700"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Services
            </a>
            <a 
              routerLink="/bookings" 
              routerLinkActive="bg-blue-100 text-blue-700"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Bookings
            </a>
            
            <!-- Mobile Search -->
            <div class="pt-2">
              <input
                type="text"
                placeholder="Search..."
                class="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    /* Custom styles for enhanced navbar */
    .navbar-shadow {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    /* Smooth transitions */
    a, button {
      transition: all 0.2s ease-in-out;
    }

    /* Active link styles */
    .router-link-active {
      color: #2563eb !important;
      border-color: #2563eb !important;
    }

    /* Mobile menu animation */
    .mobile-menu {
      animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class NavbarWithNotificationsComponent implements OnInit {
  isProfileMenuOpen: boolean = false;
  isMobileMenuOpen: boolean = false;
  userName: string = '';
  userAvatar: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    this.userName = this.authService.getUserName() || 'User';
    // You can load user avatar from a user service or profile service
    // this.userAvatar = this.userService.getUserAvatar();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    if (this.isProfileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isProfileMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
