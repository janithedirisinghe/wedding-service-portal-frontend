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
  selector: 'app-vender-chat',
  templateUrl: './vender-chat.component.html',
  styleUrls: ['./vender-chat.component.scss']
})
export class VenderChatComponent implements OnInit {
  // Treat these as customer conversations from the vendor perspective
  chats: Chat[] = [
    {
      id: 1,
      name: 'Emma Johnson',
      profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      category: 'Customer',
      messages: [
        {
          user: 'Emma Johnson',
          text: 'Hi! I love your work. Are you available on July 21st?',
          timestamp: new Date('2024-06-09T10:30:00')
        }
      ],
      lastMessage: 'Hi! I love your work. Are you available on July 21st?',
      lastMessageTime: new Date('2024-06-09T10:30:00'),
      unreadCount: 1,
      isOnline: true
    },
    {
      id: 2,
      name: 'Liam Williams',
      profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/annafali.png',
      category: 'Customer',
      messages: [],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isOnline: true
    },
    {
      id: 3,
      name: 'Ava Martinez',
      profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
      category: 'Customer',
      messages: [],
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      isOnline: false
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

  ngOnInit(): void {
    this.filteredUsers = this.allUsers;
    this.sortChatsByLastMessage();
  }

  selectChat(chat: Chat): void {
    this.selectedChat = chat;
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

      // Simulate customer response after 2 seconds
      this.simulateCustomerResponse();

      this.sortChatsByLastMessage();
    }
  }

  private simulateCustomerResponse(): void {
    setTimeout(() => {
      const responses = [
        'Thanks for the quick response! Could you share pricing?',
        'Great! What packages do you offer?',
        'We are flexible on timings. Any suggestions?',
        'Do you have availability for a rehearsal?',
        'Awesome, could we schedule a quick call?'
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const customerMessage: Message = {
        user: this.selectedChat.name,
        text: randomResponse,
        timestamp: new Date()
      };

      this.selectedChat.messages.push(customerMessage);
      this.selectedChat.lastMessage = customerMessage.text;
      this.selectedChat.lastMessageTime = customerMessage.timestamp;

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
