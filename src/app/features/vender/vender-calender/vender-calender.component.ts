import { Component, OnInit } from '@angular/core';
import { VendorMeetingService } from '../services/meeting.service';
import { BookingService, BookingRequest, BookingStatus } from '../services/booking.service';
import { AuthService } from '../../../shared/services/auth.service';
import { VendorMeetingDTO, MeetingStatus } from '../models/meeting.model';
import { forkJoin } from 'rxjs';

interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  customerName: string;
  location: string;
  mood: string;
  status: MeetingStatus;
  meetingDateTime: string;
  type: 'meeting';
}

interface BookingEvent {
  id: number;
  title: string;
  time: string;
  customerName: string;
  location: string;
  serviceName: string;
  status: BookingStatus;
  eventDate: string;
  totalAmount: number;
  type: 'booking';
}

type CalendarItem = CalendarEvent | BookingEvent;

@Component({
  selector: 'app-vender-calender',
  templateUrl: './vender-calender.component.html',
  styleUrls: ['./vender-calender.component.scss']
})
export class VenderCalenderComponent implements OnInit {
  currentMonth: Date;
  weeks: any[] = [];
  events: { [key: string]: CalendarItem[] } = {};
  isLoading: boolean = false;
  error: string | null = null;
  hoveredEvent: CalendarItem | null = null;
  popupPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(
    private vendorMeetingService: VendorMeetingService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {
    this.currentMonth = new Date();
  }

  ngOnInit() {
    this.generateCalendar();
    // Wait for auth initialization before loading data
    this.authService.waitForAuthInitialization().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadCalendarData();
      } else {
        this.error = 'Please login to view calendar.';
      }
    });
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

  loadCalendarData() {
    const vendorId = this.authService.getUserId();
    console.log('Vendor ID:', vendorId);
    
    if (!vendorId) {
      this.error = 'Vendor ID not found. Please login again.';
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.events = {}; // Clear existing events

    // Load both meetings and bookings concurrently
    forkJoin({
      meetings: this.vendorMeetingService.getVendorMeetings(vendorId),
      bookings: this.bookingService.getVendorBookings()
    }).subscribe({
      next: (data) => {
        console.log('Calendar data loaded:', data);
        this.processMeetings(data.meetings);
        this.processBookings(data.bookings);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading calendar data:', error);
        this.error = 'Failed to load calendar data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private processMeetings(meetings: VendorMeetingDTO[]) {
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
        meetingDateTime: meeting.meetingDateTime,
        type: 'meeting'
      };

      if (!this.events[dateKey]) {
        this.events[dateKey] = [];
      }
      this.events[dateKey].push(calendarEvent);
    });
  }

  private processBookings(bookings: BookingRequest[]) {
    // Filter out REJECTED bookings and group by date
    const filteredBookings = bookings.filter(booking => booking.status !== BookingStatus.REJECTED);
    
    filteredBookings.forEach(booking => {
      const bookingDate = new Date(booking.eventDate);
      const dateKey = bookingDate.toISOString().split('T')[0];
      
      const bookingEvent: BookingEvent = {
        id: booking.bookingId,
        title: `${booking.serviceName}`,
        time: booking.eventTime || 'All Day',
        customerName: booking.customerName,
        location: booking.eventLocation,
        serviceName: booking.serviceName,
        status: booking.status,
        eventDate: booking.eventDate,
        totalAmount: booking.totalAmount,
        type: 'booking'
      };

      if (!this.events[dateKey]) {
        this.events[dateKey] = [];
      }
      this.events[dateKey].push(bookingEvent);
    });
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
            meetingDateTime: meeting.meetingDateTime,
            type: 'meeting'
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

  getStatusBadgeClass(item: CalendarItem): string {
    if (item.type === 'meeting') {
      const status = item.status as MeetingStatus;
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
    } else if (item.type === 'booking') {
      const status = item.status as BookingStatus;
      switch (status) {
        case BookingStatus.CONFIRMED:
          return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case BookingStatus.PENDING:
          return 'bg-orange-100 text-orange-800 border-orange-200';
        case BookingStatus.COMPLETED:
          return 'bg-indigo-100 text-indigo-800 border-indigo-200';
        case BookingStatus.CANCELLED:
          return 'bg-slate-100 text-slate-800 border-slate-200';
        default:
          return 'bg-rose-100 text-rose-800 border-rose-200';
      }
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getItemTypeIndicator(item: CalendarItem): string {
    return item.type === 'meeting' ? '📅' : '🎉';
  }

  getBookingAmount(event: CalendarItem): number {
    return event.type === 'booking' ? (event as BookingEvent).totalAmount : 0;
  }

  getEventDate(event: CalendarItem): string {
    if (event.type === 'meeting') {
      return (event as CalendarEvent).meetingDateTime;
    } else {
      return (event as BookingEvent).eventDate;
    }
  }

  getEventMood(event: CalendarItem): string {
    return event.type === 'meeting' ? (event as CalendarEvent).mood : '';
  }

  getEventServiceName(event: CalendarItem): string {
    return event.type === 'booking' ? (event as BookingEvent).serviceName : '';
  }

  refreshCalendar() {
    this.loadCalendarData();
  }

  showEventPopup(event: CalendarItem, mouseEvent: MouseEvent) {
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

  getStatusDisplayText(item: CalendarItem): string {
    if (item.type === 'meeting') {
      const status = item.status as MeetingStatus;
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
    } else if (item.type === 'booking') {
      const status = item.status as BookingStatus;
      switch (status) {
        case BookingStatus.PENDING:
          return 'Pending Approval';
        case BookingStatus.CONFIRMED:
          return 'Confirmed';
        case BookingStatus.COMPLETED:
          return 'Completed';
        case BookingStatus.CANCELLED:
          return 'Cancelled';
        default:
          return status;
      }
    }
    return 'Unknown';
  }

  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
    this.loadCalendarData();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
    this.loadCalendarData();
  }
}
