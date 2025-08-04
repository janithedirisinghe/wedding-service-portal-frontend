import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { VendorProfileService } from '../../../features/vender/services/venderProfile.service';
import { venderDetails } from '../../../features/vender/models/vender.model';

@Component({
  selector: 'app-sidebar-two',
  templateUrl: './sidebar-two.component.html',
  styleUrls: ['./sidebar-two.component.scss']
})
export class SidebarTwoComponent implements OnInit {
  // Add any properties or methods needed for sidebar functionality
  showNotifications = false;
  vendor: venderDetails | null = null;
  defaultProfileImage = 'assets/placeholder-vendor.jpg';
  imageError = false;

  constructor(
    private authService: AuthService,
    private vendorProfileService: VendorProfileService
  ) {}

  ngOnInit(): void {
    this.loadVendorDetails();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  private loadVendorDetails(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.vendorProfileService.getVendorProfileDetails(userId).subscribe({
        next: (vendor) => {
          this.vendor = vendor;
          this.imageError = false;
        },
        error: (error) => {
          console.error('Error loading vendor details:', error);
        }
      });
    }
  }

  onImageError(event: Event): void {
    this.imageError = true;
  }

  getVendorInitials(): string {
    if (!this.vendor?.businessName) return 'V';
    return this.vendor.businessName.split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}