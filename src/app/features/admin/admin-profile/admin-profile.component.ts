import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { ChangePasswordRequest } from '../../../shared/Models/change-password.model';
import { ToastrService } from 'ngx-toastr';

interface AdminData {
  name: string;
  email: string;
  phone: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  adminData: AdminData = {
    name: 'Administrator',
    email: 'admin@wedease.com',
    phone: '+1 (555) 123-4567'
  };

  passwordData: PasswordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get admin info from auth service
    const username = this.authService.getUserName();
    const userId = this.authService.getUserId();
    
    if (username) {
      this.adminData.name = username;
      this.adminData.email = `${username}@wedease.com`; // You can customize this
    }
  }

  getInitials(): string {
    return this.adminData.name.charAt(0).toUpperCase();
  }

  updateProfile(): void {
    // TODO: Implement profile update logic
    console.log('Profile updated:', this.adminData);
    this.toastr.success('Profile updated successfully!');
  }

  changePassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastr.error('New passwords do not match!');
      return;
    }
    
    if (this.passwordData.newPassword.length < 6) {
      this.toastr.error('Password must be at least 6 characters long!');
      return;
    }

    if (!this.passwordData.currentPassword) {
      this.toastr.error('Please enter your current password!');
      return;
    }

    const changePasswordRequest: ChangePasswordRequest = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword,
      confirmPassword: this.passwordData.confirmPassword
    };

    this.authService.changePassword(changePasswordRequest).subscribe({
      next: (response) => {
        this.toastr.success('Password changed successfully!');
        
        // Clear form
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
      },
      error: (error) => {
        console.error('Password change error:', error);
        this.toastr.error('Failed to change password. Please try again.');
      }
    });
  }

  signOut(): void {
    this.authService.logout();
  }
}
