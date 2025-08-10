import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Backend DTO contracts (flexible)
export interface StartChatRequest {
  vendorId: number;
  initialMessage?: string;
}

export interface SendMessageRequest {
  chatRoomId: number;
  content: string;
}

export interface ChatRoomDTO {
  id?: number;
  chatRoomId?: number;
  vendorId?: number;
  customerId?: number;
  vendorName?: string;
  customerName?: string;
  lastMessage?: string;
  unreadCount?: number;
  lastMessageTime?: string;
  [key: string]: any;
}

export interface ChatMessageDTO {
  id?: number;
  chatRoomId: number;
  content: string;
  senderId?: number;
  senderName?: string;
  senderType?: string;
  timestamp?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseUrl = `${environment.apiUrl}/api/chat`;

  constructor(private http: HttpClient) {}

  startChat(payload: StartChatRequest): Observable<ChatRoomDTO> {
    return this.http.post<ChatRoomDTO>(`${this.baseUrl}/start`, payload);
  }

  sendMessage(payload: SendMessageRequest): Observable<ChatMessageDTO> {
    return this.http.post<ChatMessageDTO>(`${this.baseUrl}/message`, payload);
  }

  getUserChatRooms(): Observable<ChatRoomDTO[]> {
    return this.http.get<ChatRoomDTO[]>(`${this.baseUrl}/rooms`);
  }

  getChatMessages(chatRoomId: number, page = 0, size = 50): Observable<ChatMessageDTO[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<ChatMessageDTO[]>(`${this.baseUrl}/room/${chatRoomId}/messages`, { params });
  }

  markMessagesAsRead(chatRoomId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/room/${chatRoomId}/mark-read`, {});
  }

  deriveRoomDisplayName(room: ChatRoomDTO, currentUserId?: number): string {
    if (room['otherUserName']) return String(room['otherUserName']);
    if (room['counterpartName']) return String(room['counterpartName']);
    if (currentUserId) {
      if (room.vendorId && room.vendorId !== currentUserId && room.vendorName) return String(room.vendorName);
      if (room.customerId && room.customerId !== currentUserId && room.customerName) return String(room.customerName);
    }
    if (room.vendorName && room.customerName) return `${room.vendorName} ↔ ${room.customerName}`;
    if (room.vendorName) return String(room.vendorName);
    if (room.customerName) return String(room.customerName);
    const id = room.chatRoomId ?? room.id ?? '?';
    return `Chat #${id}`;
  }

  getRoomId(room: ChatRoomDTO): number {
    return Number(room.chatRoomId ?? room.id);
  }

  getMessageTimestamp(msg: ChatMessageDTO): Date | null {
    if (!msg) return null;
    if (msg.timestamp) return new Date(msg.timestamp);
    if ((msg as any).createdAt) return new Date((msg as any).createdAt);
    return null;
  }
}
