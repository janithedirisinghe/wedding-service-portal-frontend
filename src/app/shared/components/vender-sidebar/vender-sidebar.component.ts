import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { VendorProfileService } from '../../../features/vender/services/venderProfile.service';
import { venderDetails } from '../../../features/vender/models/vender.model';

@Component({
  selector: 'app-vender-sidebar',
  templateUrl: './vender-sidebar.component.html',
  styleUrl: './vender-sidebar.component.scss'
})
export class VenderSidebarComponent implements OnInit {
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

  getProfileImageUrl(): string {
    return this.vendor?.profileImageUrl || this.defaultProfileImage;
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
