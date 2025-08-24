import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../shared/services/chat.service';
import { ChatWebsocketService } from '../../../shared/services/chat-websocket.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ChatRoomDTO, ChatMessageDTO, Message, Chat, User } from '../models';

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
  allUsers: User[] = [
    { id: 1, name: 'Luxury Wedding Videography', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/stephenshaw.png', email: 'contact@luxuryweddingvideo.com', category: 'Videography', isOnline: true },
    { id: 2, name: 'Artisan Cake Studio', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png', email: 'orders@artisancakes.com', category: 'Bakery', isOnline: true },
    { id: 3, name: 'Bridal Beauty Experts', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png', email: 'bookings@bridalbeauty.com', category: 'Beauty', isOnline: false },
    { id: 4, name: 'Vintage Car Rentals', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png', email: 'rent@vintagecarweddings.com', category: 'Transportation', isOnline: true },
    { id: 5, name: 'Floral Paradise', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png', email: 'hello@floralparadise.com', category: 'Florist', isOnline: false },
    { id: 6, name: 'Dream Destination Weddings', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png', email: 'plan@dreamdestinations.com', category: 'Destination Planner', isOnline: true }
  ];

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
    this.chatApi.getUserChatRooms(userId).subscribe({ 
      next: rooms => {
        console.log('Loaded chat rooms:', rooms); // Debug log
        const uid = this.auth.getUserId() || undefined;
        this.chats = rooms.map(r => ({
          id: this.chatApi.getRoomId(r),
          name: this.chatApi.deriveRoomDisplayName(r, uid),
          profileImage: 'assets/placeholder-vendor.jpg',
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
      }
    });

    // mark read
    this.chatApi.markMessagesAsRead(chat.id).subscribe();

    // subscribe real-time
    this.ws.subscribe(`/topic/chat/${chat.id}`, (payload: ChatMessageDTO) => {
      const msg = this.fromDtoToMessage(payload);
      chat.messages.push(msg);
      chat.lastMessage = msg.text;
      chat.lastMessageTime = msg.timestamp;
      this.sortChatsByLastMessage();
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
  }

  private fromDtoToMessage(dto: ChatMessageDTO): Message {
    const myId = this.auth.getUserId();
    const ts = this.chatApi.getMessageTimestamp(dto) || new Date();
    const senderName = dto.senderId && myId && dto.senderId === myId ? (this.username || 'You') : (dto.senderName || 'User');
    return { user: senderName, text: dto.content, timestamp: ts };
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
