import { Component, OnInit } from '@angular/core';
import { VendorMeetingService } from '../services/meeting.service';
import { VendorMeetingDTO, MeetingStatus, MeetingMood, MeetingActionRequest } from '../models/meeting.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-vender-meeting-requsts',
  templateUrl: './vender-meeting-requsts.component.html',
  styleUrls: ['./vender-meeting-requsts.component.scss'],
})
export class VenderMeetingRequstsComponent implements OnInit {
  Math = Math;
  meetingRequests: VendorMeetingDTO[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  isLoading = false;
  error: string | null = null;
  
  // Status and mood enums for template
  MeetingStatus = MeetingStatus;
  MeetingMood = MeetingMood;

  constructor(
    private vendorMeetingService: VendorMeetingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Wait for auth initialization before fetching data
    this.authService.waitForAuthInitialization().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.fetchMeetingRequests();
      } else {
        this.error = 'Please login to view meeting requests.';
      }
    });
  }

  fetchMeetingRequests() {
    const vendorId = this.authService.getUserId();
    console.log('Vendor ID:', vendorId); // Debug log
    if (!vendorId) {
      this.error = 'Vendor ID not found. Please login again.';
      return;
    }

    this.isLoading = true;
    this.error = null;

    console.log('Fetching meetings for vendor ID:', vendorId); // Debug log
    this.vendorMeetingService.getVendorMeetings(vendorId).subscribe({
      next: (meetings: VendorMeetingDTO[]) => {
        console.log('Raw meetings response from API:', meetings); // Log the response
        console.log('Number of meetings received:', meetings.length);
        
        // Debug: Log the structure of the first meeting to understand the API response
        if (meetings.length > 0) {
          console.log('First meeting object keys:', Object.keys(meetings[0]));
          console.log('First meeting object:', meetings[0]);
          console.log('First meeting ID check:', meetings[0].meetingId);
          console.log('Customer info:', {
            customerId: meetings[0].customerId,
            customerName: meetings[0].customerName,
            customerEmail: meetings[0].customerEmail
          });
        }
        
        // Process meetings ensuring all VendorMeetingDTO fields are properly handled
        this.meetingRequests = meetings
          .filter((meeting: VendorMeetingDTO) => {
            // Basic validation to ensure we have essential data
            return meeting && 
                   meeting.meetingDateTime && 
                   meeting.requestedAt;
          })
          .map((meeting: VendorMeetingDTO) => {
            // Ensure all required fields are present with fallbacks
            return {
              ...meeting,
              meetingId: meeting.meetingId || 0,
              customerName: meeting.customerName || 'Unknown Customer',
              customerEmail: meeting.customerEmail || 'No email provided',
              location: meeting.location || 'No location specified',
              status: meeting.status || MeetingStatus.PENDING,
              meetingMood: meeting.meetingMood || MeetingMood.VIRTUAL,
              customerId: meeting.customerId || 0,
              vendorId: meeting.vendorId || vendorId,
              vendorBusinessName: meeting.vendorBusinessName || 'Current Vendor',
              vendorEmail: meeting.vendorEmail || 'vendor@example.com'
            } as VendorMeetingDTO;
          })
          .sort((a: VendorMeetingDTO, b: VendorMeetingDTO) => {
            // Sort by requestedAt date (newest first)
            const dateA = new Date(a.requestedAt);
            const dateB = new Date(b.requestedAt);
            return dateB.getTime() - dateA.getTime();
          });
        
        console.log('Final processed meetings:', this.meetingRequests); // Log after processing
        console.log('Number of processed meetings:', this.meetingRequests.length);
        this.totalItems = this.meetingRequests.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching meeting requests:', error);
        console.error('Error status:', error.status);
        console.error('Error body:', error.error);
        
        let errorMessage = 'Failed to load meeting requests. ';
        if (error.message) {
          errorMessage += error.message;
        } else {
          errorMessage += 'Please try again later.';
        }
        
        this.error = errorMessage;
        this.isLoading = false;
      }
    });
  }

  // Confirm a meeting request
  confirmMeeting(meetingId: number) {
    const action: MeetingActionRequest = { status: MeetingStatus.CONFIRMED, meetingId: meetingId };
    this.updateMeetingStatus(meetingId, action);
  }

  // Reject a meeting request
  rejectMeeting(meetingId: number, rejectionReason?: string) {
    const action: MeetingActionRequest = { 
      status: MeetingStatus.REJECTED,
      rejectionReason: rejectionReason || 'No reason provided',
      meetingId: meetingId
    };
    this.updateMeetingStatus(meetingId, action);
  }

  // Update meeting status
  private updateMeetingStatus(meetingId: number, action: MeetingActionRequest) {
    const vendorId = this.authService.getUserId();
    if (!vendorId) {
      this.error = 'Vendor ID not found. Please login again.';
      return;
    }
    
    this.vendorMeetingService.updateMeetingStatus(vendorId, action).subscribe({
      next: (updatedMeeting: VendorMeetingDTO) => {
        // Update the meeting in the local array
        const index = this.meetingRequests.findIndex((m: VendorMeetingDTO) => m.meetingId === meetingId);
        if (index !== -1) {
          this.meetingRequests[index] = updatedMeeting;
          console.log('Meeting updated successfully:', updatedMeeting);
        }
      },
      error: (error) => {
        console.error('Error updating meeting status:', error);
        this.error = `Failed to update meeting: ${error.message}`;
      }
    });
  }

  // Format date for display
  formatDateTime(dateString: string): string {
    if (!dateString) {
      return 'No date provided';
    }
    
    const date = new Date(dateString);
    if (!date || isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Get status color class
  getStatusColor(status: MeetingStatus): string {
    switch (status) {
      case MeetingStatus.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case MeetingStatus.CONFIRMED:
        return 'text-green-600 bg-green-100';
      case MeetingStatus.REJECTED:
        return 'text-red-600 bg-red-100';
      case MeetingStatus.CANCELLED:
        return 'text-gray-600 bg-gray-100';
      case MeetingStatus.COMPLETED:
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // Get meeting mood display text
  getMeetingMoodText(mood: MeetingMood): string {
    if (!mood) {
      return 'Not specified';
    }
    
    switch (mood) {
      case MeetingMood.VIRTUAL:
        return 'Virtual Meeting';
      case MeetingMood.PHONE_CALL:
        return 'Phone Call';
      case MeetingMood.IN_PERSON:
        return 'In-Person Meeting';
      default:
        return String(mood);
    }
  }

  get paginatedRequests() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.meetingRequests.slice(start, end);
  }

  changePage(page: number) {
    if (page > 0 && page <= Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage = page;
    }
  }

  // Refresh the meeting requests
  refreshMeetings() {
    this.fetchMeetingRequests();
  }
}
