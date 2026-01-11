import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { VendorProfileService } from '../../../features/vender/services/venderProfile.service';
import { venderDetails } from '../../../features/vender/models/vender.model';

@Component({
  selector: 'app-vender-header',
  templateUrl: './vender-header.component.html',
  styleUrls: ['./vender-header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class VenderHeaderComponent implements OnInit {
  @Input() pageTitle: string = '';
  @Input() subtitle: string = '';
  
  vendor: venderDetails | null = null;
  defaultProfileImage = 'assets/placeholder-vendor.jpg';
  imageError = false;
  
  constructor(
    private authService: AuthService,
    private vendorProfileService: VendorProfileService
  ) { }

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

  getVendorInitials(): string {
    if (!this.vendor?.businessName) return 'V';
    return this.vendor.businessName.split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}