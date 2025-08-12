export interface ChatMessageDTO {
  id?: number;
  chatRoomId: number;
  content: string;
  senderId?: number;
  senderName?: string;
  senderType?: string;
  timestamp?: string;
  createdAt?: string;
}

export interface ChatRoomDTO {
  chatRoomId: number;
  roomName: string;
  customerId: number;
  customerName: string;
  vendorId: number;
  vendorName: string;
  vendorBusinessName: string;
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
