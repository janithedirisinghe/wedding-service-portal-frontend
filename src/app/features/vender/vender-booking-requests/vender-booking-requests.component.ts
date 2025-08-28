import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { BookingService, BookingRequest, BookingStatus, BookingActionRequest, BookingDecisionDto } from '../services/booking.service';

@Component({
  selector: 'app-vender-booking-requests',
  templateUrl: './vender-booking-requests.component.html',
  styleUrls: ['./vender-booking-requests.component.scss']
})
export class VenderBookingRequestsComponent implements OnInit {
  Math = Math;
  bookingRequests: BookingRequest[] = [];
  filteredBookingRequests: BookingRequest[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  isLoading = false;
  error: string | null = null;
  
  // Filter and search
  searchTerm = '';
  statusFilter = '';
  
  // Modal
  selectedBooking: BookingRequest | null = null;
  
  // Status enum for template
  BookingStatus = BookingStatus;

  constructor(
    private authService: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    // Wait for auth initialization before fetching data
    this.authService.waitForAuthInitialization().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.fetchBookingRequests();
      } else {
        this.error = 'Please login to view booking requests.';
      }
    });
  }

  fetchBookingRequests() {
    const vendorId = this.authService.getUserId();
    console.log('Vendor ID:', vendorId);
    
    if (!vendorId) {
      this.error = 'Vendor ID not found. Please login again.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    console.log('Fetching booking requests for vendor ID:', vendorId);
    this.bookingService.getVendorBookings().subscribe({
      next: (bookings) => {
        console.log('Raw booking response from API:', bookings);
        console.log('Number of bookings received:', bookings.length);
        
        this.bookingRequests = bookings.sort((a, b) => {
          // Sort by requestedAt date (newest first)
          const dateA = new Date(a.requestedAt);
          const dateB = new Date(b.requestedAt);
          return dateB.getTime() - dateA.getTime();
        });
        
        console.log('Sorted bookings:', this.bookingRequests);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching booking requests:', error);
        console.error('Error status:', error.status);
        console.error('Error body:', error.error);
        
        let errorMessage = 'Failed to load booking requests. ';
        if (error.status === 401) {
          errorMessage += 'Please login again.';
        } else if (error.status === 403) {
          errorMessage += 'You do not have permission to view bookings.';
        } else if (error.status === 0) {
          errorMessage += 'Unable to connect to server. Please check your connection.';
        } else if (error.message) {
          errorMessage += error.message;
        } else {
          errorMessage += 'Please try again later.';
        }
        
        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }

  // Filter and search functions
  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = this.bookingRequests;

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.serviceName.toLowerCase().includes(searchLower) ||
        booking.serviceCategory.toLowerCase().includes(searchLower) ||
        booking.eventLocation.toLowerCase().includes(searchLower) ||
        booking.bookingId.toString().includes(searchLower)
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(booking => booking.status === this.statusFilter);
    }

    this.filteredBookingRequests = filtered;
    this.totalItems = filtered.length;
  }
 
  // Booking actions
  confirmBooking(bookingId: number, vendorNotes?: string) {
    // You can add a confirmation dialog here if needed
    const notes = vendorNotes || 'Booking accepted. We look forward to working with you!';
    
    this.bookingService.acceptBooking(bookingId, notes).subscribe({
      next: (updatedBooking) => {
        // Update the booking in the local array
        const index = this.bookingRequests.findIndex(b => b.bookingId === bookingId);
        if (index !== -1) {
          this.bookingRequests[index] = updatedBooking;
          this.applyFilters();
        }
        console.log(`Booking ${bookingId} confirmed successfully`);
        // Clear any previous errors
        this.error = null;
      },
      error: (error) => {
        console.error('Error confirming booking:', error);
        let errorMessage = 'Failed to confirm booking: ';
        if (error.status === 404) {
          errorMessage += 'Booking not found.';
        } else if (error.status === 403) {
          errorMessage += 'You do not have permission to modify this booking.';
        } else if (error.status === 400) {
          errorMessage += 'Invalid booking status or already processed.';
        } else {
          errorMessage += error.message || 'Please try again';
        }
        this.error = errorMessage;
      }
    });
  }

  rejectBooking(bookingId: number, rejectionReason?: string) {
    // You can add a confirmation dialog here if needed
    const reason = rejectionReason || 'Unfortunately, we cannot accommodate this booking at this time.';
    
    this.bookingService.rejectBooking(bookingId, reason).subscribe({
      next: (updatedBooking) => {
        // Update the booking in the local array
        const index = this.bookingRequests.findIndex(b => b.bookingId === bookingId);
        if (index !== -1) {
          this.bookingRequests[index] = updatedBooking;
          this.applyFilters();
        }
        console.log(`Booking ${bookingId} rejected successfully`);
        // Clear any previous errors
        this.error = null;
      },
      error: (error) => {
        console.error('Error rejecting booking:', error);
        let errorMessage = 'Failed to reject booking: ';
        if (error.status === 404) {
          errorMessage += 'Booking not found.';
        } else if (error.status === 403) {
          errorMessage += 'You do not have permission to modify this booking.';
        } else if (error.status === 400) {
          errorMessage += 'Invalid booking status or already processed.';
        } else {
          errorMessage += error.message || 'Please try again';
        }
        this.error = errorMessage;
      }
    });
  }

  // Quick action methods for the UI
  quickAcceptBooking(bookingId: number) {
    this.confirmBooking(bookingId);
  }

  quickRejectBooking(bookingId: number) {
    this.rejectBooking(bookingId);
  }

  // Method to accept booking with custom notes (can be called from modal)
  acceptBookingWithNotes(bookingId: number, notes: string) {
    this.confirmBooking(bookingId, notes);
  }

  // Method to reject booking with custom reason (can be called from modal)
  rejectBookingWithReason(bookingId: number, reason: string) {
    this.rejectBooking(bookingId, reason);
  }

  // Modal functions
  viewBookingDetails(booking: BookingRequest) {
    this.selectedBooking = booking;
  }

  closeModal() {
    this.selectedBooking = null;
  }

  // Utility functions
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (!date || isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    if (!date || isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  getStatusColor(status: BookingStatus): string {
    switch (status) {
      case BookingStatus.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case BookingStatus.CONFIRMED:
        return 'text-green-600 bg-green-100';
      case BookingStatus.REJECTED:
        return 'text-red-600 bg-red-100';
      case BookingStatus.CANCELLED:
        return 'text-gray-600 bg-gray-100';
      case BookingStatus.COMPLETED:
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // Pagination
  get paginatedRequests() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredBookingRequests.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    const totalPages = this.totalPages;
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  refreshBookings() {
    this.fetchBookingRequests();
  }
}
