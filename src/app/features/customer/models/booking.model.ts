export interface BookingRequest {
  serviceId: number;
  eventDate: string; // ISO date string
  eventLocation: string;
  specialRequirements?: string;
  proposedPrice: number;
}

export interface BookingResponse {
  bookingId: number;
  serviceId: number;
  customerId: number;
  vendorId: number;
  eventDate: string;
  eventLocation: string;
  specialRequirements?: string;
  proposedPrice: number;
  status: BookingStatus;
  createdDate: string;
  lastModifiedDate: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}
