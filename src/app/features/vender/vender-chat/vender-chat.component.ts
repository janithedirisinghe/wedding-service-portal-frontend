import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService, ChatRoomDTO, ChatMessageDTO } from '../../../shared/services/chat.service';
import { ChatWebsocketService } from '../../../shared/services/chat-websocket.service';
import { AuthService } from '../../../shared/services/auth.service';

// Interfaces
interface Message {
  user: string;
  text: string;
  timestamp: Date;
}

interface Chat {
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

interface User {
  id: number;
  name: string;
  profileImage: string;
  email: string;
  category: string;
  isOnline: boolean;
}

@Component({
  selector: 'app-vender-chat',
  templateUrl: './vender-chat.component.html',
  styleUrls: ['./vender-chat.component.scss']
})
export class VenderChatComponent implements OnInit, OnDestroy {
  // Treat these as customer conversations from the vendor perspective
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
  allUsers: User[] = [
    { id: 1, name: 'Noah Davis', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/stephenshaw.png', email: 'noah@example.com', category: 'Customer', isOnline: true },
    { id: 2, name: 'Olivia Brown', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png', email: 'olivia@example.com', category: 'Customer', isOnline: true },
    { id: 3, name: 'Sophia Wilson', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png', email: 'sophia@example.com', category: 'Customer', isOnline: false },
    { id: 4, name: 'Jackson Miller', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png', email: 'jackson@example.com', category: 'Customer', isOnline: true }
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
    if (this.currentRoomId) this.ws.unsubscribe(`/topic/chat/${this.currentRoomId}`);
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
        if (this.chats.length > 0) {
          this.selectedChat = this.chats[0];
          this.onChatSelectedSetup(this.selectedChat);
        }
        this.sortChatsByLastMessage();
      }
    });
  }

  selectChat(chat: Chat): void {
    this.selectedChat = chat;
    this.selectedChat.unreadCount = 0;
    this.onChatSelectedSetup(chat);
  }

  private onChatSelectedSetup(chat: Chat): void {
    if (this.currentRoomId) {
      this.ws.unsubscribe(`/topic/chat/${this.currentRoomId}`);
      this.ws.leaveRoom(this.currentRoomId);
    }
    this.currentRoomId = chat.id;
    this.chatApi.getChatMessages(chat.id, 0, 50).subscribe({
      next: msgs => {
        chat.messages = msgs.map(m => this.fromDtoToMessage(m));
        this.sortChatsByLastMessage();
      }
    });
    this.chatApi.markMessagesAsRead(chat.id).subscribe();
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
    const existingChat = this.chats.find((chat: Chat) => chat.name === user.name);

    if (existingChat) {
      this.selectedChat = existingChat;
    } else {
      const newChat: Chat = {
        id: this.chats.length + 1,
        name: user.name,
        profileImage: user.profileImage,
        category: user.category,
        messages: [],
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: 0,
        isOnline: user.isOnline
      };

      this.chats.unshift(newChat);
      this.selectedChat = newChat;
      this.filterChats();
    }

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

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
    }, 1000);
  }
}
