export interface VendorMeetingDTO {
  meetingId: number;
  meetingDateTime: string; // Format: 'yyyy-MM-dd HH:mm:ss'
  meetingMood: MeetingMood;
  location: string;
  status: MeetingStatus;
  notes?: string;
  rejectionReason?: string;
  requestedAt: string;
  confirmedAt?: string;
  
  // Customer information
  customerId: number;
  customerName: string;
  customerEmail: string;
  
  // Vendor information
  vendorId: number;
  vendorBusinessName: string;
  vendorEmail: string;
}

export enum MeetingMood {
  VIRTUAL = 'VIRTUAL',
  PHONE_CALL = 'PHONE_CALL',
  IN_PERSON = 'IN_PERSON'
}

export enum MeetingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface MeetingActionRequest {
  meetingId: number;
  status: MeetingStatus;
  rejectionReason?: string;
}
