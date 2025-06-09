import { Component } from '@angular/core';

@Component({
  selector: 'app-navbartwo',
  templateUrl: './navbartwo.component.html',
  styleUrl: './navbartwo.component.scss'
})
export class NavbartwoComponent {
  searchQuery: string = '';
  showNotifications: boolean = false;
  unreadNotifications: number = 3;
  
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
