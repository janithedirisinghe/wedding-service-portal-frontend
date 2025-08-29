import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Vendor } from '../vendor-search/vendor-search.component';
import { FollowService } from '../services/follow.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CustomerMeetingService } from '../services/customer-meeting.service';
import { CustomerBookingService, BookingResponseDto, BookingStatus } from '../services/customer-booking.service';
import { PaymentService } from '../services/payment.service';
import { convertToFrontendVendor } from '../models/vendor.model';
import { CustomerMeetingDTO, MeetingMood, MeetingStatus } from '../models/meeting.model';

@Component({
  selector: 'app-customer-favorites',
  templateUrl: './customer-favorites.component.html',
  styleUrls: ['./customer-favorites.component.scss']
})
export class CustomerFavoritesComponent implements OnInit {
  
  // Tab management
  activeTab: 'overview' | 'favorites' | 'meetings' | 'bookings' | 'weddingSummary' = 'overview';
  
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

  // Bookings properties
  customerBookings: BookingResponseDto[] = [];
  filteredBookings: BookingResponseDto[] = [];
  isBookingsLoading: boolean = false;
  bookingsError: string | null = null;
  bookingStatusFilter: string = '';
  bookingSearchTerm: string = '';
  selectedBooking: BookingResponseDto | null = null;
  showBookingModal: boolean = false;
  showPaymentModal: boolean = false;
  bookingForPayment: BookingResponseDto | null = null;
  
  // Pagination properties for bookings
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  paginatedBookings: BookingResponseDto[] = [];

  // Enums for template
  MeetingMood = MeetingMood;
  MeetingStatus = MeetingStatus;
  BookingStatus = BookingStatus;
  
  // Math for template
  Math = Math;

  constructor(
    public router: Router,
    private followService: FollowService,
    private authService: AuthService,
    private customerMeetingService: CustomerMeetingService,
    private customerBookingService: CustomerBookingService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.loadMeetings();
    this.loadBookings();
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
          const summariesMap = new Map<number, { followerCount?: number; reviewCount?: number; averageRating?: number; profileImageUrl?: string }>();
          (response.followingSummaries || []).forEach(s => {
            summariesMap.set(s.vendorId, {
              followerCount: s.followerCount,
              reviewCount: s.reviewCount,
              averageRating: s.averageRating,
              profileImageUrl: s.profileImageUrl
            });
          });
          this.favoriteVendors = response.following.map(v => convertToFrontendVendor(v, summariesMap.get(v.venderId)));
          
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

  getPendingMeetingsCount(): number {
    return this.customerMeetings.filter(meeting => meeting.status === 'PENDING').length;
  }

  getPaymentDueCount(): number {
    return this.customerBookings.filter(booking => 
      booking.status === 'ACCEPTED'
    ).length;
  }

  // Wedding Summary Methods
  getConfirmedBookings(): BookingResponseDto[] {
    return this.customerBookings.filter(booking => booking.status === 'ACCEPTED');
  }

  getTotalWeddingCost(): number {
    return this.getConfirmedBookings().reduce((total, booking) => total + booking.proposedPrice, 0);
  }

  getTotalServiceCost(): number {
    return this.getConfirmedBookings().reduce((total, booking) => total + booking.servicePricing, 0);
  }

  getRemainingPayment(): number {
    const totalCost = this.getTotalWeddingCost();
    const serviceCost = this.getTotalServiceCost();
    return totalCost - serviceCost;
  }

  getWeddingDate(): Date | null {
    const confirmedBookings = this.getConfirmedBookings();
    if (confirmedBookings.length === 0) return null;
    
    // Return the earliest event date from confirmed bookings
    return confirmedBookings
      .map(booking => new Date(booking.eventDate))
      .sort((a, b) => a.getTime() - b.getTime())[0];
  }

  getWeddingLocation(): string {
    const confirmedBookings = this.getConfirmedBookings();
    if (confirmedBookings.length === 0) return 'Not specified';
    
    // Get the most common location or the first one
    const locations = confirmedBookings.map(booking => booking.eventLocation);
    return locations[0] || 'Not specified';
  }

  getBookingsByVendorType(): { [key: string]: BookingResponseDto[] } {
    const confirmedBookings = this.getConfirmedBookings();
    return confirmedBookings.reduce((groups, booking) => {
      const type = booking.vendorType;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(booking);
      return groups;
    }, {} as { [key: string]: BookingResponseDto[] });
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

  navigateToVendorReview(vendorId: number): void {
    // Navigate to the vendor's profile page where reviews can be added
    // You can adjust this route based on your app's routing structure
    this.router.navigate(['/customer/vender-profile'], { 
      queryParams: { vendorId: vendorId, showReviews: true } 
    });
  }

  // Bookings functionality
  loadBookings(): void {
    this.isBookingsLoading = true;
    this.bookingsError = null;
    
    this.customerBookingService.getCustomerBookings().subscribe({
      next: (bookings) => {
        this.customerBookings = bookings.sort((a, b) => {
          // Sort by requestDate (newest first)
          const dateA = new Date(a.requestDate);
          const dateB = new Date(b.requestDate);
          return dateB.getTime() - dateA.getTime();
        });
        this.filterBookings();
        this.updatePagination();
        this.isBookingsLoading = false;
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        // For development, fallback to dummy data if API fails
        console.log('Falling back to dummy data for development...');
        this.customerBookings = this.getDummyBookings();
        this.filterBookings();
        this.updatePagination();
        this.isBookingsLoading = false;
        this.bookingsError = null; // Clear error since we have fallback data
      }
    });
  }

  getDummyBookings(): BookingResponseDto[] {
    return [
      {
        bookingId: 1,
        vendorBusinessName: 'Elegant Events Photography',
        vendorId: 1,
        vendorType: 'Photography',
        serviceName: 'Wedding Photography Package',
        serviceId: 1,
        serviceDescription: 'Complete wedding photography coverage',
        servicePricing: 2000,
        eventDate: new Date('2024-09-15'),
        eventLocation: 'Central Park, New York',
        proposedPrice: 2500,
        status: BookingStatus.ACCEPTED,
        requestDate: new Date('2024-08-01T10:30:00Z'),
        responseDate: new Date('2024-08-02T14:20:00Z'),
        specialRequirements: 'Please bring extra lenses for outdoor shots',
        customerId: 1,
        customerFirstName: 'John',
        customerLastName: 'Doe'
      },
      {
        bookingId: 2,
        vendorBusinessName: 'Harmony Wedding Planners',
        vendorId: 2,
        vendorType: 'Wedding Planning',
        serviceName: 'Full Wedding Planning',
        serviceId: 2,
        serviceDescription: 'Complete wedding planning service',
        servicePricing: 4500,
        eventDate: new Date('2024-09-15'),
        eventLocation: 'Grand Ballroom, Hotel Plaza',
        proposedPrice: 5000,
        status: BookingStatus.PENDING,
        requestDate: new Date('2024-08-10T14:20:00Z'),
        specialRequirements: 'Need vegetarian and gluten-free options',
        customerId: 1,
        customerFirstName: 'John',
        customerLastName: 'Doe'
      },
      {
        bookingId: 3,
        vendorBusinessName: 'Sweet Dreams Catering',
        vendorId: 3,
        vendorType: 'Catering',
        serviceName: 'Wedding Reception Catering',
        serviceId: 3,
        serviceDescription: 'Full catering service for wedding reception',
        servicePricing: 3000,
        eventDate: new Date('2024-09-15'),
        eventLocation: 'Grand Ballroom, Hotel Plaza',
        proposedPrice: 3500,
        status: BookingStatus.ACCEPTED,
        requestDate: new Date('2024-08-05T09:15:00Z'),
        responseDate: new Date('2024-08-06T16:30:00Z'),
        specialRequirements: 'Menu for 150 guests with dietary restrictions',
        customerId: 1,
        customerFirstName: 'John',
        customerLastName: 'Doe'
      }
    ];
  }

  filterBookings(): void {
    let filtered = [...this.customerBookings];

    // Filter by status
    if (this.bookingStatusFilter) {
      filtered = filtered.filter(booking => booking.status === this.bookingStatusFilter);
    }

    // Filter by search term
    if (this.bookingSearchTerm.trim()) {
      const searchTerm = this.bookingSearchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.vendorBusinessName.toLowerCase().includes(searchTerm) ||
        booking.serviceName.toLowerCase().includes(searchTerm) ||
        booking.vendorType.toLowerCase().includes(searchTerm) ||
        booking.bookingId.toString().includes(searchTerm)
      );
    }

    this.filteredBookings = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalItems = this.filteredBookings.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedBookings = this.filteredBookings.slice(startIndex, endIndex);
  }

  onBookingSearchChange(): void {
    this.currentPage = 1;
    this.filterBookings();
  }

  onBookingFilterChange(): void {
    this.currentPage = 1;
    this.filterBookings();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getBookingStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
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

  formatDate(dateString: string | Date): string {
    if (!dateString) return '';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  }

  formatDateTime(dateTimeString: string | Date): string {
    if (!dateTimeString) return '';
    const date = typeof dateTimeString === 'string' ? new Date(dateTimeString) : dateTimeString;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  viewBookingDetails(booking: BookingResponseDto): void {
    this.selectedBooking = booking;
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    this.selectedBooking = null;
  }

  cancelBooking(bookingId: number): void {
    this.customerBookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        // Refresh bookings list
        this.loadBookings();
        this.closeBookingModal();
        console.log('Booking cancelled successfully');
      },
      error: (error) => {
        console.error('Error cancelling booking:', error);
        // Handle error (show toast, etc.)
      }
    });
  }

  contactVendorFromBooking(vendorId: number): void {
    this.router.navigate(['/customer/chat'], { queryParams: { vendorId: vendorId } });
    this.closeBookingModal();
  }

  // Payment functionality
  openPaymentModal(booking: BookingResponseDto): void {
    this.bookingForPayment = booking;
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.bookingForPayment = null;
  }

  onPaymentSuccess(paymentResponse: any): void {
    console.log('Payment successful:', paymentResponse);
    // Refresh bookings to show updated status
    this.loadBookings();
    this.closePaymentModal();
    // You can add a success message here
  }

  onPaymentError(error: string): void {
    console.error('Payment error:', error);
    // Handle payment error (show toast, etc.)
  }

  refreshBookings(): void {
    this.loadBookings();
  }
}
