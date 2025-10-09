import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BookingResponseDto, BookingStatus } from '../../services/customer-booking.service';
import jsPDF from 'jspdf';

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

  /**
   * Generate and download booking invoice as PDF
   */
  downloadInvoice(): void {
    if (!this.booking) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = 20;

    // Header - Company/Service Name
    doc.setFillColor(147, 51, 234); // Purple color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('WEDDING SERVICE BOOKING', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Invoice / Booking Confirmation', pageWidth / 2, 30, { align: 'center' });

    // Reset text color for the rest of the document
    doc.setTextColor(0, 0, 0);
    yPosition = 55;

    // Invoice Details Header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
    doc.text(`Booking ID: #${this.booking.bookingId}`, pageWidth - margin - 50, yPosition);
    yPosition += 10;

    // Status Badge
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    if (this.booking.status === BookingStatus.CONFIRMED) {
      doc.setTextColor(22, 163, 74); // Green
      doc.text(`Status: ${this.booking.status}`, margin, yPosition);
    } else {
      doc.setTextColor(0, 0, 0);
      doc.text(`Status: ${this.booking.status}`, margin, yPosition);
    }
    doc.setTextColor(0, 0, 0);
    yPosition += 15;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Customer Information Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Information', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${this.booking.customerFirstName} ${this.booking.customerLastName}`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`Customer ID: ${this.booking.customerId}`, margin + 5, yPosition);
    yPosition += 12;

    // Vendor Information Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Vendor Information', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Business Name: ${this.booking.vendorBusinessName}`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`Vendor Type: ${this.booking.vendorType}`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`Vendor ID: ${this.booking.vendorId}`, margin + 5, yPosition);
    yPosition += 12;

    // Service Details Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Service Details', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Service Name: ${this.booking.serviceName}`, margin + 5, yPosition);
    yPosition += 6;
    
    if (this.booking.serviceDescription) {
      doc.text('Description:', margin + 5, yPosition);
      yPosition += 6;
      // Wrap long text
      const splitDescription = doc.splitTextToSize(this.booking.serviceDescription, pageWidth - margin * 2 - 10);
      doc.text(splitDescription, margin + 10, yPosition);
      yPosition += (splitDescription.length * 5) + 6;
    } else {
      yPosition += 6;
    }

    // Event Information Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Event Information', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Event Date: ${this.formatDate(this.booking.eventDate)}`, margin + 5, yPosition);
    yPosition += 6;
    doc.text(`Event Location: ${this.booking.eventLocation}`, margin + 5, yPosition);
    yPosition += 6;

    if (this.booking.specialRequirements) {
      doc.text('Special Requirements:', margin + 5, yPosition);
      yPosition += 6;
      const splitRequirements = doc.splitTextToSize(this.booking.specialRequirements, pageWidth - margin * 2 - 10);
      doc.text(splitRequirements, margin + 10, yPosition);
      yPosition += (splitRequirements.length * 5) + 6;
    }
    yPosition += 6;

    // Pricing Section
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition, pageWidth - margin * 2, 40, 'F');
    yPosition += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Pricing Details', margin + 5, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Standard Service Price: Rs ${this.booking.servicePricing.toLocaleString()}`, margin + 5, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Agreed Price: Rs ${this.booking.proposedPrice.toLocaleString()}`, margin + 5, yPosition);
    yPosition += 15;

    // Booking Timeline Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Booking Timeline', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Request Date: ${this.formatDateTime(this.booking.requestDate)}`, margin + 5, yPosition);
    yPosition += 6;

    if (this.booking.responseDate) {
      doc.text(`Response Date: ${this.formatDateTime(this.booking.responseDate)}`, margin + 5, yPosition);
      yPosition += 6;
    }

    if (this.booking.vendorNotes) {
      yPosition += 6;
      doc.setFont('helvetica', 'bold');
      doc.text('Vendor Notes:', margin + 5, yPosition);
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      const splitNotes = doc.splitTextToSize(this.booking.vendorNotes, pageWidth - margin * 2 - 10);
      doc.text(splitNotes, margin + 10, yPosition);
      yPosition += (splitNotes.length * 5);
    }

    // Footer
    yPosition = pageHeight - 30;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });

    // Save the PDF
    const fileName = `Booking_Invoice_${this.booking.bookingId}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
  }
}
