import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BookingResponseDto, BookingStatus } from '../../services/customer-booking.service';

@Component({
  selector: 'app-booking-details-modal',
  templateUrl: './booking-details-modal.component.html',
  styleUrls: ['./booking-details-modal.component.scss']
})
export class BookingDetailsModalComponent {
  @Input() booking: BookingResponseDto | null = null;
  @Input() isVisible: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() cancelBooking = new EventEmitter<number>();
  @Output() contactVendor = new EventEmitter<number>();

  BookingStatus = BookingStatus;

  close(): void {
    this.closeModal.emit();
  }

  onCancelBooking(): void {
    if (this.booking) {
      this.cancelBooking.emit(this.booking.bookingId);
    }
  }

  onContactVendor(): void {
    if (this.booking) {
      this.contactVendor.emit(this.booking.vendorId);
    }
  }

  getStatusClass(status: string): string {
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

  formatDate(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }

  formatDateTime(date: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
