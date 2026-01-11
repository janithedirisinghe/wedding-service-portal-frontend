export interface ChatMessageDTO {
  messageId: number;
  chatRoomId: number;
  senderId: number;
  senderName: string;
  senderType: string; // CUSTOMER or VENDOR
  content: string;
  sentAt: string;
  messageType: string;
  status: string;
  readAt?: string;
  attachmentUrl?: string;
  attachmentType?: string;
}

export interface ChatRoomDTO {
  chatRoomId: number;
  roomName: string;
  customerId: number;
  customerName: string;
  vendorId: number;
  vendorName: string;
  vendorBusinessName: string;
  vendorProfileImageUrl: string;
  customerProfileImageUrl: string;
  createdAt: string;
  lastMessageAt: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED'; // ChatRoom.ChatStatus enum
  recentMessages: ChatMessageDTO[]; // Last few messages for preview
  unreadCount: number;
}

export interface StartChatRequest {
  vendorId: number;
  initialMessage?: string;
}

export interface SendMessageRequest {
  chatRoomId: number;
  content: string;
}

// Frontend-specific interfaces for UI
export interface Message {
  messageId?: number;
  user: string;
  text: string;
  timestamp: Date;
}

export interface Chat {
  id: number;
  name: string;
  profileImage: string;
  category: string;
  messages: Message[];
  lastMessage: string | null;
  lastMessageTime: Date | null;
  unreadCount: number;
  isOnline: boolean;
}

export interface User {
  id: number;
  name: string;
  profileImage: string;
  email: string;
  category: string;
  isOnline: boolean;
}
