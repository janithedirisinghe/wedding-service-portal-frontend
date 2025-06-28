import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { venderDetails } from '../models/vender.model';
import { VendorProfileService } from '../services/venderProfile.service';
import { VenderHeaderComponent } from '../../../shared/components/vender-header/vender-header.component';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-vender-profile',
  templateUrl: './vender-profile.component.html',
  standalone: true,
  imports: [CommonModule, VenderHeaderComponent], // Import CommonModule and VenderHeaderComponent
  styleUrls: ['./vender-profile.component.css']
})
export class VenderProfileComponent implements OnInit {
  vendor: venderDetails | null = null; 
  error: string = ''; 
  showMore: boolean = false; 
  constructor(private vendorProfileService: VendorProfileService, @Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = Number(this.authService.getUserId());
    this.getvenderDetails(userId);
  }
  selectedTab: string = 'posts';
   getVenderProfileDetails(venderId: number){
   }

  getvenderDetails(venderId: number) {
    if (isPlatformBrowser(this.platformId)) {    
      if (venderId && !isNaN(Number(venderId))) {
        this.vendorProfileService.getVendorProfileDetails(Number(venderId)).subscribe(
          (data) => {
            this.vendor = data;
            console.log(data);
          },
          (error) => {
            this.error = 'Failed to load vendor data';
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
