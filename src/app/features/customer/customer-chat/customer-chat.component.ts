import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../shared/services/chat.service';
import { ChatWebsocketService } from '../../../shared/services/chat-websocket.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ChatRoomDTO, ChatMessageDTO, Message, Chat, User, VendorListDTO } from '../models';

@Component({
  selector: 'app-customer-chat',
  templateUrl: './customer-chat.component.html',
  styleUrls: ['./customer-chat.component.scss']
})
export class CustomerChatComponent implements OnInit, OnDestroy {
  // Initially seed with a placeholder to keep template stable until backend loads
  chats: Chat[] = [
    {
      id: 0,
      name: 'Loading…',
      profileImage: 'assets/placeholder-vendor.jpg',
      category: '—',
      messages: [],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isOnline: true
    }
  ];

  selectedChat: Chat = this.chats[0];
  newMessage: string = '';
  username: string = 'You';
  searchTerm: string = '';
  filteredChats: Chat[] = this.chats;

  showNewConversationPopup = false;
  newConversationSearchTerm = '';
  filteredUsers: User[] = [];
  // Replace with real search later if backend provides; keep UI mock list for now
  allUsers: User[] = [];

  isTyping = false;
  typingTimeout: any;

  private currentRoomId?: number;

  constructor(
    private chatApi: ChatService,
    private ws: ChatWebsocketService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.filteredUsers = this.allUsers;
    this.username = this.auth.getUserName() || 'You';
    this.loadRooms();
    this.loadVendors();
    this.ws.connect();
  }

  ngOnDestroy(): void {
    if (this.currentRoomId) {
      this.ws.unsubscribe(`/topic/chat/${this.currentRoomId}`);
    }
    this.ws.disconnect();
  }

  private loadRooms(): void {
    const userId = Number(this.auth.getUserId());
    this.chatApi.getCustomerChatRooms(userId).subscribe({ 
      next: rooms => {
        console.log('Loaded chat rooms:', rooms); // Debug log
        const uid = this.auth.getUserId() || undefined;
        this.chats = rooms.map(r => ({
          id: this.chatApi.getRoomId(r),
          name: this.chatApi.deriveRoomDisplayName(r, uid),
          profileImage: r.vendorProfileImageUrl || 'assets/placeholder-vendor.jpg',
          category: r.vendorBusinessName || 'Chat',
          messages: [],
          lastMessage: r.recentMessages && r.recentMessages.length > 0 ? r.recentMessages[r.recentMessages.length - 1].content : null,
          lastMessageTime: r.lastMessageAt ? new Date(r.lastMessageAt) : null,
          unreadCount: r.unreadCount || 0,
          isOnline: true
        }));
        
        // Remove the placeholder loading chat if we have real data
        if (this.chats.length > 0) {
          this.selectedChat = this.chats[0];
          this.onChatSelectedSetup(this.selectedChat);
        }
        this.sortChatsByLastMessage();
      },
      error: (error) => {
        console.error('Failed to load chat rooms:', error);
        // keep placeholder chats if backend not reachable
      }
    });
  }

  private loadVendors(): void {
    this.chatApi.getAllVendorsForChat().subscribe({
      next: vendors => {
        this.allUsers = vendors.map(v => ({
          id: v.venderId,
          name: v.businessName,
          profileImage: v.profileImageUrl || 'assets/placeholder-vendor.jpg',
          email: '', // Not provided in DTO
          category: v.venType,
          isOnline: v.isActive
        }));
        this.filteredUsers = this.allUsers;
      },
      error: (error) => {
        console.error('Failed to load vendors:', error);
        // Fallback to empty list or keep previous if any
        this.allUsers = [];
        this.filteredUsers = this.allUsers;
      }
    });
  }

  selectChat(chat: Chat): void {
    this.selectedChat = chat;
    this.selectedChat.unreadCount = 0;
    this.onChatSelectedSetup(chat);
  }

  private onChatSelectedSetup(chat: Chat): void {
    // unsubscribe previous
    if (this.currentRoomId) {
      this.ws.unsubscribe(`/topic/chat/${this.currentRoomId}`);
  this.ws.leaveRoom(this.currentRoomId);
    }
    this.currentRoomId = chat.id;

    // load history
    this.chatApi.getChatMessages(chat.id, 0, 50).subscribe({
      next: msgs => {
        chat.messages = msgs.map(m => this.fromDtoToMessage(m));
        this.sortChatsByLastMessage();
        // Scroll to bottom after loading historical messages
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });

    // mark read
    this.chatApi.markMessagesAsRead(chat.id).subscribe();

    // subscribe real-time
    this.ws.subscribe(`/topic/chat/${chat.id}`, (payload: ChatMessageDTO) => {
      // Check if this message is already in the chat (prevent duplicates using messageId)
      const existingMessage = chat.messages.find(msg => msg.messageId === payload.messageId);

      if (!existingMessage) {
        const msg = this.fromDtoToMessage(payload);
        chat.messages.push(msg);
        chat.lastMessage = msg.text;
        chat.lastMessageTime = msg.timestamp;
        this.sortChatsByLastMessage();
        // Scroll to bottom when new message arrives
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  this.ws.joinRoom(chat.id);
  }

  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text || !this.selectedChat) return;
    const roomId = this.selectedChat.id;
    // Publish via STOMP so all subscribers (including self) receive the message
    this.ws.send(`/app/chat/${roomId}`, { chatRoomId: roomId, content: text });
    this.newMessage = '';

    // Reload chat messages after sending to ensure consistency with backend
    this.reloadChatMessages(roomId);
  }

  private fromDtoToMessage(dto: ChatMessageDTO): Message {
    const myId = this.auth.getUserId();
    const ts = this.chatApi.getMessageTimestamp(dto) || new Date();
    const senderName = dto.senderId && myId && dto.senderId === myId ? (this.username || 'You') : (dto.senderName || 'User');
    return { messageId: dto.messageId, user: senderName, text: dto.content, timestamp: ts };
  }

  private reloadChatMessages(chatRoomId: number): void {
    if (!this.selectedChat) return;

    this.chatApi.getChatMessages(chatRoomId, 0, 50).subscribe({
      next: msgs => {
        // Clear existing messages and reload from backend
        this.selectedChat.messages = msgs.map(m => this.fromDtoToMessage(m));
        this.sortChatsByLastMessage();
        // Scroll to bottom after loading messages
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Failed to reload chat messages:', error);
      }
    });
  }

  private scrollToBottom(): void {
    const messagesContainer = document.querySelector('.messages-container') as HTMLElement;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  private sortChatsByLastMessage(): void {
    this.chats.sort((a: Chat, b: Chat) => {
      const timeA = a.lastMessageTime ? a.lastMessageTime.getTime() : 0;
      const timeB = b.lastMessageTime ? b.lastMessageTime.getTime() : 0;
      return timeB - timeA; // Most recent first
    });
    this.filterChats();
  }

  filterChats(): void {
    this.filteredChats = this.chats.filter((chat: Chat) => 
      chat.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      chat.category.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openNewConversationPopup(): void {
    this.showNewConversationPopup = true;
    this.newConversationSearchTerm = '';
    this.filteredUsers = this.allUsers;
  }

  closeNewConversationPopup(): void {
    this.showNewConversationPopup = false;
    this.newConversationSearchTerm = '';
  }

  filterUsers(): void {
    this.filteredUsers = this.allUsers.filter((user: User) =>
      user.name.toLowerCase().includes(this.newConversationSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.newConversationSearchTerm.toLowerCase()) ||
      user.category.toLowerCase().includes(this.newConversationSearchTerm.toLowerCase())
    );
  }

  startConversation(user: User): void {
    // If already exists, just select it
    const existingChat = this.chats.find((chat: Chat) => chat.name === user.name);
    if (existingChat) {
      this.selectedChat = existingChat;
      this.onChatSelectedSetup(existingChat);
      this.closeNewConversationPopup();
      return;
    }

    // Ask backend to start chat with vendor
    this.chatApi.startChat({ vendorId: user.id }).subscribe({
      next: (room) => {
        const newChat: Chat = {
          id: this.chatApi.getRoomId(room),
          name: this.chatApi.deriveRoomDisplayName(room, this.auth.getUserId() || undefined) || user.name,
          profileImage: user.profileImage,
          category: room.vendorBusinessName || user.category || 'Chat',
          messages: [],
          lastMessage: room.recentMessages && room.recentMessages.length > 0 ? room.recentMessages[room.recentMessages.length - 1].content : null,
          lastMessageTime: room.lastMessageAt ? new Date(room.lastMessageAt) : null,
          unreadCount: room.unreadCount || 0,
          isOnline: user.isOnline
        };
        this.chats.unshift(newChat);
        this.selectedChat = newChat;
        this.filterChats();
        this.onChatSelectedSetup(newChat);
      },
      error: () => {
        // Fallback to local if backend fails
        const fallback: Chat = {
          id: Date.now(),
          name: user.name,
          profileImage: user.profileImage,
          category: user.category,
          messages: [],
          lastMessage: null,
          lastMessageTime: null,
          unreadCount: 0,
          isOnline: user.isOnline
        };
        this.chats.unshift(fallback);
        this.selectedChat = fallback;
        this.filterChats();
        this.onChatSelectedSetup(fallback);
      }
    });
    this.closeNewConversationPopup();
  }
  getRelativeTime(date: Date | null): string {
    if (!date) {
      return '';
    }
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    return date.toLocaleDateString();
  }

  onMessageInputKeyup(): void {
    this.isTyping = true;
    
    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    // Set new timeout
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
    }, 1000);
  }
}
