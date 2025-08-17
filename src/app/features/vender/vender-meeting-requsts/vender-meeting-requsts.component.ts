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
    this.fetchMeetingRequests();
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
      next: (meetings) => {
        console.log('Raw meetings response from API:', meetings); // Log the response
        console.log('Number of meetings received:', meetings.length);
        this.meetingRequests = meetings.sort((a, b) => {
          // Sort by requestedAt date (newest first)
          const dateA = new Date(a.requestedAt);
          const dateB = new Date(b.requestedAt);
          return dateB.getTime() - dateA.getTime();
        });
        console.log('Sorted meetings:', this.meetingRequests); // Log after sorting
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
    this.vendorMeetingService.updateMeetingStatus(vendorId, action).subscribe({
      next: (updatedMeeting) => {
        // Update the meeting in the local array
        const index = this.meetingRequests.findIndex(m => m.meetingId === meetingId);
        if (index !== -1) {
          this.meetingRequests[index] = updatedMeeting;
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
    switch (mood) {
      case MeetingMood.VIRTUAL:
        return 'Virtual Meeting';
      case MeetingMood.PHONE_CALL:
        return 'Phone Call';
      case MeetingMood.IN_PERSON:
        return 'In-Person Meeting';
      default:
        return mood;
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
