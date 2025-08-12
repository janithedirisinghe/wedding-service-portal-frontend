import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatRoomDTO, ChatMessageDTO, StartChatRequest, SendMessageRequest } from '../../features/customer/models';

// Re-export types for easier importing
export { ChatRoomDTO, ChatMessageDTO, StartChatRequest, SendMessageRequest } from '../../features/customer/models';

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
    // Use roomName if available, otherwise derive from vendor business name or vendor name
    if (room.roomName) return room.roomName;
    
    // For customers, show vendor business name or vendor name
    if (currentUserId && room.customerId === currentUserId) {
      return room.vendorBusinessName || room.vendorName || `Chat #${room.chatRoomId}`;
    }
    
    // For vendors, show customer name
    if (currentUserId && room.vendorId === currentUserId) {
      return room.customerName || `Chat #${room.chatRoomId}`;
    }
    
    // Default fallback
    return room.vendorBusinessName || room.vendorName || room.customerName || `Chat #${room.chatRoomId}`;
  }

  getRoomId(room: ChatRoomDTO): number {
    return room.chatRoomId;
  }

  getMessageTimestamp(msg: ChatMessageDTO): Date | null {
    if (!msg) return null;
    if (msg.timestamp) return new Date(msg.timestamp);
    if ((msg as any).createdAt) return new Date((msg as any).createdAt);
    return null;
  }
}
