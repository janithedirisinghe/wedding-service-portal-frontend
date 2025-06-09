import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-two',
  templateUrl: './sidebar-two.component.html',
  styleUrls: ['./sidebar-two.component.scss']
})
export class SidebarTwoComponent {
  // Add any properties or methods needed for sidebar functionality
  showNotifications = false;

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}