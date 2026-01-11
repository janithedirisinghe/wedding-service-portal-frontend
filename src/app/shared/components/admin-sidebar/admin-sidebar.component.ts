import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  adminName: string = 'Administrator';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Get admin info from auth service
    const username = this.authService.getUserName();
    if (username) {
      this.adminName = username;
    }
  }

  getInitials(): string {
    return this.adminName.charAt(0).toUpperCase();
  }
}
