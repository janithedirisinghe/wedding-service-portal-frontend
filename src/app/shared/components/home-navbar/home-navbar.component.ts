import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home-navbar',
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.scss',
})
export class HomeNavbarComponent {
  items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home'
            },
            {
                label: 'Service',
                icon: 'pi pi-star'
            },
            {
                label: 'Contact',
                icon: 'pi pi-envelope',
            }
        ];
    }
}
