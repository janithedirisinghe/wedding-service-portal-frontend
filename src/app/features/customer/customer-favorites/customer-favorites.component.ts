import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vendor } from '../vendor-search/vendor-search.component';
import { FollowService } from '../services/follow.service';
import { AuthService } from '../../../shared/services/auth.service';
import { convertToFrontendVendor } from '../models/vendor.model';

@Component({
  selector: 'app-customer-favorites',
  templateUrl: './customer-favorites.component.html',
  styleUrls: ['./customer-favorites.component.scss']
})
export class CustomerFavoritesComponent implements OnInit {
  
  favoriteVendors: Vendor[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    public router: Router,
    private followService: FollowService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.error = null;
    
    const userId = this.authService.getUserId();
    if (!userId) {
      this.error = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    this.followService.getCustomerFollowing(userId).subscribe({
      next: (response) => {
        if (response.success) {
          this.favoriteVendors = response.following.map(convertToFrontendVendor);
          
          if (this.favoriteVendors.length === 0) {
            this.error = 'No favorite vendors found';
          }
        } else {
          this.error = response.message || 'Failed to load favorites';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading favorites:', error);
        this.error = 'Failed to load favorites. Please try again.';
        this.isLoading = false;
      }
    });
  }

  removeFromFavorites(vendor: Vendor): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    const vendorId = parseInt(vendor.id);
    this.followService.unfollowVendor(userId, vendorId).subscribe({
      next: (response) => {
        if (response.success) {
          vendor.isFavorite = false;
          this.favoriteVendors = this.favoriteVendors.filter(v => v.id !== vendor.id);
          console.log(`Removed ${vendor.businessName} from favorites`);
        } else {
          console.error('Failed to remove from favorites:', response.message);
        }
      },
      error: (error) => {
        console.error('Error removing from favorites:', error);
      }
    });
  }

  contactVendor(vendor: Vendor): void {
    this.router.navigate(['/customer/chat'], { queryParams: { vendorId: vendor.id } });
  }

  viewVendorProfile(vendor: Vendor): void {
    this.router.navigate(['/customer/vender-profile'], { 
      queryParams: { vendorId: vendor.id } 
    });
  }
}
