import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vender-profile',
  templateUrl: './vender-profile.component.html',
  standalone: true,
  imports: [CommonModule], // Import CommonModule here
  styleUrls: ['./vender-profile.component.css']
})
export class VenderProfileComponent implements OnInit {
  ngOnInit(): void {
    // Initialization logic here
  }
  selectedTab: string = 'posts';

  reviews = [
    {
      name: 'Janith Edirisinghe',
      location: 'Anuradhapura',
      date: '2024.12.12',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inventore sed error repudiandae...'
    },
    {
      name: 'Janith Edirisinghe',
      location: 'Anuradhapura',
      date: '2024.12.12',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inventore sed error repudiandae...'
    },
    {
      name: 'Janith Edirisinghe',
      location: 'Anuradhapura',
      date: '2024.12.12',
      rating: 4.9,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Inventore sed error repudiandae...'
    }
  ];

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}
