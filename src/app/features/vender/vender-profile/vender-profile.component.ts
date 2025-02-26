import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { venderDetails } from '../models/vender.model';
import { VendorProfileService } from '../services/venderProfile.service';

@Component({
  selector: 'app-vender-profile',
  templateUrl: './vender-profile.component.html',
  standalone: true,
  imports: [CommonModule], // Import CommonModule here
  styleUrls: ['./vender-profile.component.css']
})
export class VenderProfileComponent implements OnInit {
  vendor: venderDetails | null = null;  // Variable to hold the vendor data
  error: string = '';  // For error handling
  showMore: boolean = false;  // Property to show more details
  // showAllServices: boolean = false;

  constructor(private vendorProfileService: VendorProfileService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    
    // Initialization logic here
    this.getvenderDetails();
  }
  selectedTab: string = 'posts';

  getvenderDetails() {
    // Check if the code is running in the browser
    if (isPlatformBrowser(this.platformId)) {
      const venderId = localStorage.getItem('vendorId');
      
      // Check if venderId is not null and is a valid number
      if (venderId && !isNaN(Number(venderId))) {
        this.vendorProfileService.getVendorProfileDetails(Number(venderId)).subscribe(
          (data) => {
            this.vendor = data;  // Assign fetched data to the vendor variable
            console.log(data);
          },
          (error) => {
            this.error = 'Failed to load vendor data';  // Handle error
            console.error(error);
          }
        );
      } else {
        this.error = 'Invalid vendor ID';
        console.error('Invalid vendor ID');
      }
    }
  }
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
