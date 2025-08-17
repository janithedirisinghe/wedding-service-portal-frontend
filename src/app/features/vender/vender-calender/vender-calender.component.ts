import { Component, OnInit } from '@angular/core';
import { VendorMeetingService } from '../services/meeting.service';
import { AuthService } from '../../../shared/services/auth.service';
import { VendorMeetingDTO, MeetingStatus } from '../models/meeting.model';

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  customerName: string;
  location: string;
  mood: string;
  status: MeetingStatus;
  meetingDateTime: string;
}

@Component({
  selector: 'app-vender-calender',
  templateUrl: './vender-calender.component.html',
  styleUrls: ['./vender-calender.component.scss']
})
export class VenderCalenderComponent implements OnInit {
  currentMonth: Date;
  weeks: any[] = [];
  events: { [key: string]: CalendarEvent[] } = {};
  isLoading: boolean = false;
  error: string | null = null;
  hoveredEvent: CalendarEvent | null = null;
  popupPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(
    private vendorMeetingService: VendorMeetingService,
    private authService: AuthService
  ) {
    this.currentMonth = new Date();
  }

  ngOnInit() {
    this.generateCalendar();
    this.loadVendorMeetings();
  }

  generateCalendar() {
    const startOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      currentWeek.push(new Date(currentDate));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.weeks = weeks;
  }
  isToday(day: Date): boolean {
    const today = new Date();
    return day.getDate() === today.getDate() && 
           day.getMonth() === today.getMonth() && 
           day.getFullYear() === today.getFullYear();
  }

  loadVendorMeetings() {
    const vendorId = this.authService.getUserId();
    console.log('Vendor ID:', vendorId);
    
    if (!vendorId) {
      this.error = 'Vendor ID not found. Please login again.';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.events = {}; // Clear existing events

    console.log('Fetching meetings for vendor ID:', vendorId);
    this.vendorMeetingService.getVendorMeetings(vendorId).subscribe({
      next: (meetings) => {
        console.log('Raw meetings response from API:', meetings);
        console.log('Number of meetings received:', meetings.length);
        
        // Filter out REJECTED meetings and group by date
        const filteredMeetings = meetings.filter(meeting => meeting.status !== MeetingStatus.REJECTED);
        
        filteredMeetings.forEach(meeting => {
          const meetingDate = new Date(meeting.meetingDateTime);
          const dateKey = meetingDate.toISOString().split('T')[0];
          
          const calendarEvent: CalendarEvent = {
            id: meeting.meetingId,
            title: `Meeting with ${meeting.customerName}`,
            time: this.formatTime(meeting.meetingDateTime),
            customerName: meeting.customerName,
            location: meeting.location,
            mood: meeting.meetingMood,
            status: meeting.status,
            meetingDateTime: meeting.meetingDateTime
          };

          if (!this.events[dateKey]) {
            this.events[dateKey] = [];
          }
          this.events[dateKey].push(calendarEvent);
        });

        this.isLoading = false;
        console.log('Processed events:', this.events);
      },
      error: (error) => {
        console.error('Error fetching vendor meetings:', error);
        this.error = 'Failed to load meetings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  getStatusBadgeClass(status: MeetingStatus): string {
    switch (status) {
      case MeetingStatus.CONFIRMED:
        return 'bg-green-100 text-green-800 border-green-200';
      case MeetingStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case MeetingStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case MeetingStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  }

  refreshCalendar() {
    this.loadVendorMeetings();
  }

  showEventPopup(event: CalendarEvent, mouseEvent: MouseEvent) {
    this.hoveredEvent = event;
    
    // Calculate popup position with boundary checking
    const popupWidth = 320; // max-w-sm ≈ 320px
    const popupHeight = 250; // estimated height
    const margin = 10;
    
    let x = mouseEvent.clientX + margin;
    let y = mouseEvent.clientY + margin;
    
    // Check right boundary
    if (x + popupWidth > window.innerWidth) {
      x = mouseEvent.clientX - popupWidth - margin;
    }
    
    // Check bottom boundary
    if (y + popupHeight > window.innerHeight) {
      y = mouseEvent.clientY - popupHeight - margin;
    }
    
    // Ensure popup doesn't go off left or top edges
    x = Math.max(margin, x);
    y = Math.max(margin, y);
    
    this.popupPosition = { x, y };
  }

  hideEventPopup() {
    this.hoveredEvent = null;
  }

  getMoodDisplayText(mood: string): string {
    switch (mood) {
      case 'VIRTUAL':
        return 'Virtual Meeting';
      case 'PHONE_CALL':
        return 'Phone Call';
      case 'IN_PERSON':
        return 'In Person';
      default:
        return mood;
    }
  }

  getStatusDisplayText(status: MeetingStatus): string {
    switch (status) {
      case MeetingStatus.PENDING:
        return 'Pending Approval';
      case MeetingStatus.CONFIRMED:
        return 'Confirmed';
      case MeetingStatus.COMPLETED:
        return 'Completed';
      case MeetingStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  }

  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
    this.loadVendorMeetings(); // Load real data instead of dummy events
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
    this.loadVendorMeetings(); // Load real data instead of dummy events
  }
}
