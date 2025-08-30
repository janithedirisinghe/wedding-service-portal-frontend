import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss']
})
export class AdminNavbarComponent implements OnInit {
  searchQuery: string = '';
  showNotifications: boolean = false;
  showProfileMenu: boolean = false;
  adminName: string = 'Administrator';
  adminEmail: string = 'admin@wedease.com';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get admin info from auth service
    const username = this.authService.getUserName();
    if (username) {
      this.adminName = username;
      this.adminEmail = `${username}@wedease.com`; // You can customize this
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false;
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false;
  }

  getInitials(): string {
    return this.adminName.charAt(0).toUpperCase();
  }

  changePassword() {
    this.showProfileMenu = false;
    this.router.navigate(['/admin/profile']);
  }

  signOut() {
    this.showProfileMenu = false;
    this.authService.logout();
  }
}
