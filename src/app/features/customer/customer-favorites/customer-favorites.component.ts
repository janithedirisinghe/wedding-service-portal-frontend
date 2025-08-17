import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vendor } from '../vendor-search/vendor-search.component';
import { FollowService } from '../services/follow.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CustomerMeetingService } from '../services/customer-meeting.service';
import { convertToFrontendVendor } from '../models/vendor.model';
import { CustomerMeetingDTO, MeetingMood, MeetingStatus } from '../models/meeting.model';

@Component({
  selector: 'app-customer-favorites',
  templateUrl: './customer-favorites.component.html',
  styleUrls: ['./customer-favorites.component.scss']
})
export class CustomerFavoritesComponent implements OnInit {
  
  // Tab management
  activeTab: 'favorites' | 'meetings' = 'favorites';
  
  // Favorites properties
  favoriteVendors: Vendor[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  // Meetings properties
  customerMeetings: CustomerMeetingDTO[] = [];
  filteredMeetings: CustomerMeetingDTO[] = [];
  isMeetingsLoading: boolean = false;
  meetingsError: string | null = null;
  selectedStatus: string = '';

  // Enums for template
  MeetingMood = MeetingMood;
  MeetingStatus = MeetingStatus;

  constructor(
    public router: Router,
    private followService: FollowService,
    private authService: AuthService,
    private customerMeetingService: CustomerMeetingService
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

  // New methods for meetings functionality
  loadMeetings(): void {
    this.isMeetingsLoading = true;
    this.meetingsError = null;
    
    const userId = this.authService.getUserId();
    if (!userId) {
      this.meetingsError = 'User not authenticated';
      this.isMeetingsLoading = false;
      return;
    }

    this.customerMeetingService.getCustomerMeetings(userId).subscribe({
      next: (meetings) => {
        this.customerMeetings = meetings.sort((a, b) => {
          // Sort by requestedAt date (newest first)
          const dateA = new Date(a.requestedAt);
          const dateB = new Date(b.requestedAt);
          return dateB.getTime() - dateA.getTime();
        });
        this.filterMeetings();
        this.isMeetingsLoading = false;
      },
      error: (error) => {
        console.error('Error loading meetings:', error);
        this.meetingsError = 'Failed to load meeting requests. Please try again.';
        this.isMeetingsLoading = false;
      }
    });
  }

  filterMeetings(): void {
    if (!this.selectedStatus) {
      this.filteredMeetings = [...this.customerMeetings];
    } else {
      this.filteredMeetings = this.customerMeetings.filter(
        meeting => meeting.status === this.selectedStatus
      );
    }
  }

  getMeetingStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getMeetingMoodText(mood: MeetingMood): string {
    switch (mood) {
      case MeetingMood.VIRTUAL:
        return 'Virtual Meeting';
      case MeetingMood.PHONE_CALL:
        return 'Phone Call';
      case MeetingMood.IN_PERSON:
        return 'In-Person Meeting';
      default:
        return 'Unknown';
    }
  }

  formatMeetingDateTime(dateTimeString: string): string {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  viewVendorProfile(item: Vendor | CustomerMeetingDTO): void {
    if ('vendorId' in item) {
      // It's a CustomerMeetingDTO
      this.router.navigate(['/customer/vender-profile'], { 
        queryParams: { vendorId: item.vendorId } 
      });
    } else {
      // It's a Vendor
      this.router.navigate(['/customer/vender-profile'], { 
        queryParams: { vendorId: item.id } 
      });
    }
  }

  contactVendorForMeeting(meeting: CustomerMeetingDTO): void {
    this.router.navigate(['/customer/chat'], { 
      queryParams: { vendorId: meeting.vendorId } 
    });
  }
}
