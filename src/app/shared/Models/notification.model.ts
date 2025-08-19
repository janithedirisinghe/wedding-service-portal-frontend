export enum NotificationType {
  BOOKING_REQUEST = 'BOOKING_REQUEST',
  BOOKING_ACCEPTED = 'BOOKING_ACCEPTED',
  BOOKING_REJECTED = 'BOOKING_REJECTED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_COMPLETED = 'BOOKING_COMPLETED',
  
  MEETING_REQUEST = 'MEETING_REQUEST',
  MEETING_ACCEPTED = 'MEETING_ACCEPTED',
  MEETING_REJECTED = 'MEETING_REJECTED',
  MEETING_CANCELLED = 'MEETING_CANCELLED',
  MEETING_REMINDER = 'MEETING_REMINDER',
  
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  FOLLOW_REQUEST = 'FOLLOW_REQUEST',
  
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  GENERAL = 'GENERAL'
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface NotificationResponseDTO {
  notificationId: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  priority: NotificationPriority;
  relatedEntityId: number | null;
  createdAt: string; // ISO datetime string
  readAt: string | null; // ISO datetime string
}

export interface NotificationPageResponse {
  content: NotificationResponseDTO[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}

// Utility interface for local component usage
export interface NotificationDisplay {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: Date;
  readAt: Date | null;
  relatedEntityId: number | null;
}
