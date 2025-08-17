export interface MeetingRequestDTO {
  meetingDateTime: string; // ISO 8601 format: 'yyyy-MM-dd HH:mm:ss'
  meetingMood: MeetingMood;
  location: string;
  vendorId: number;
  notes?: string;
}

export interface MeetingDTO {
  id: number;
  meetingDateTime: string;
  meetingMood: MeetingMood;
  location: string;
  notes?: string;
  status: MeetingStatus;
  customerId: number;
  vendorId: number;
  createdAt: string;
  updatedAt: string;
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
  COMPLETED = 'COMPLETED'
}

export interface CreateMeetingRequest {
  meetingDateTime: string;
  meetingMood: MeetingMood;
  location: string;
  vendorId: number;
  notes?: string;
}
