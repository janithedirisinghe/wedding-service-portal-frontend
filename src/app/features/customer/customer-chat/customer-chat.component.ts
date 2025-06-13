import { Component, OnInit } from '@angular/core';

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
  selector: 'app-customer-chat',
  templateUrl: './customer-chat.component.html',
  styleUrls: ['./customer-chat.component.scss']
})
export class CustomerChatComponent implements OnInit {
  chats: Chat[] = [
    { 
      id: 1, 
      name: 'Elite Wedding Photography', 
      profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', 
      category: 'Photography', 
      messages: [
        {
          user: 'Elite Wedding Photography',
          text: 'Hello! Thank you for your interest in our wedding photography services. How can I help you today?',
          timestamp: new Date('2024-06-09T10:30:00')
        }
      ],
      lastMessage: 'Hello! Thank you for your interest...',
      lastMessageTime: new Date('2024-06-09T10:30:00'),
      unreadCount: 1,
      isOnline: true
    },
    { 
      id: 2, 
      name: 'Elegant Floral Designs', 
      profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png', 
      category: 'Florist', 
      messages: [],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isOnline: true
    },
    { 
      id: 3, 
      name: 'Grand Ballroom Venue', 
      profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png', 
      category: 'Venue', 
      messages: [],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isOnline: false
    },
    { 
      id: 4, 
      name: 'Melodic Wedding Band', 
      profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png', 
      category: 'Music', 
      messages: [],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isOnline: true
    },
    { 
      id: 5, 
      name: 'Sweet Dreams Catering', 
      profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png', 
      category: 'Catering', 
      messages: [],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isOnline: false
    },
    { 
      id: 6, 
      name: 'Perfect Day Planning', 
      profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png', 
      category: 'Wedding Planner', 
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
    { id: 1, name: 'Luxury Wedding Videography', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/stephenshaw.png', email: 'contact@luxuryweddingvideo.com', category: 'Videography', isOnline: true },
    { id: 2, name: 'Artisan Cake Studio', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/elwinsharvill.png', email: 'orders@artisancakes.com', category: 'Bakery', isOnline: true },
    { id: 3, name: 'Bridal Beauty Experts', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png', email: 'bookings@bridalbeauty.com', category: 'Beauty', isOnline: false },
    { id: 4, name: 'Vintage Car Rentals', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png', email: 'rent@vintagecarweddings.com', category: 'Transportation', isOnline: true },
    { id: 5, name: 'Floral Paradise', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png', email: 'hello@floralparadise.com', category: 'Florist', isOnline: false },
    { id: 6, name: 'Dream Destination Weddings', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png', email: 'plan@dreamdestinations.com', category: 'Destination Planner', isOnline: true }
  ];

  isTyping = false;
  typingTimeout: any;

  ngOnInit(): void {
    this.filteredUsers = this.allUsers;
    // Sort chats by last message time
    this.sortChatsByLastMessage();
  }

  selectChat(chat: Chat): void {
    this.selectedChat = chat;
    // Mark messages as read
    this.selectedChat.unreadCount = 0;
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message: Message = {
        user: this.username,
        text: this.newMessage.trim(),
        timestamp: new Date()
      };
      
      this.selectedChat.messages.push(message);
      this.selectedChat.lastMessage = message.text;
      this.selectedChat.lastMessageTime = message.timestamp;
      
      this.newMessage = '';
      
      // Simulate vendor response after 2 seconds
      this.simulateVendorResponse();
      
      // Re-sort chats to move current chat to top
      this.sortChatsByLastMessage();
    }
  }

  private simulateVendorResponse(): void {
    setTimeout(() => {
      const responses = [
        "Thank you for your message! I'll get back to you shortly with more details.",
        "That sounds great! Let me check our availability for your wedding date.",
        "I'd be happy to help you with that. Could you share more details about your requirements?",
        "Perfect! I'll prepare a customized quote for you. When is your wedding date?",
        "Absolutely! We have experience with that type of event. Let's discuss the details."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const vendorMessage: Message = {
        user: this.selectedChat.name,
        text: randomResponse,
        timestamp: new Date()
      };
      
      this.selectedChat.messages.push(vendorMessage);
      this.selectedChat.lastMessage = vendorMessage.text;
      this.selectedChat.lastMessageTime = vendorMessage.timestamp;
      
      this.sortChatsByLastMessage();
    }, 2000);
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
    // Check if chat already exists
    const existingChat = this.chats.find((chat: Chat) => chat.name === user.name);
    
    if (existingChat) {
      this.selectedChat = existingChat;
    } else {
      // Create new chat
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
      
      this.chats.unshift(newChat); // Add to beginning of array
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
