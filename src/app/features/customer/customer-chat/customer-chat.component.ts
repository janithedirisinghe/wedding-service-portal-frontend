import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-chat',
  templateUrl: './customer-chat.component.html',
  styleUrls: ['./customer-chat.component.scss']
})
export class CustomerChatComponent implements OnInit {
  chats: Chat[] = [
    { id: 1, name: 'John Doe', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Friend', messages: [] },
    { id: 2, name: 'Jane Smith', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Family', messages: [] },
    { id: 3, name: 'Alice Johnson', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Colleague', messages: [] },
    { id: 4, name: 'Bob Brown', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Friend', messages: [] },
    { id: 5, name: 'Charlie Davis', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Family', messages: [] },
    { id: 6, name: 'Diana Evans', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Colleague', messages: [] },
    { id: 7, name: 'Ethan Foster', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Friend', messages: [] },
    { id: 8, name: 'Fiona Green', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Family', messages: [] },
    { id: 9, name: 'George Harris', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Colleague', messages: [] },
    { id: 10, name: 'Hannah Irving', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Friend', messages: [] },
    { id: 11, name: 'Ian Jackson', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Family', messages: [] },
    { id: 12, name: 'Julia King', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', category: 'Colleague', messages: [] }
  ];

  selectedChat: Chat = this.chats[0];
  newMessage: string = '';
  username: string = 'User' + Math.floor(Math.random() * 1000);
  searchTerm: string = '';
  filteredChats: Chat[] = this.chats;

  showNewConversationPopup = false;
  newConversationSearchTerm = '';
  filteredUsers: User[] = [];
  allUsers: User[] = [
    { id: 1, name: 'John Doe', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'jane@example.com' },
    { id: 3, name: 'Alice Johnson', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'alice@example.com' },
    { id: 4, name: 'Bob Brown', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'bob@example.com' },
    { id: 5, name: 'Charlie Davis', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'charlie@example.com' },
    { id: 6, name: 'Diana Evans', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'diana@example.com' },
    { id: 7, name: 'Ethan Foster', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'ethan@example.com' },
    { id: 8, name: 'Fiona Green', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'fiona@example.com' },
    { id: 9, name: 'George Harris', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'george@example.com' },
    { id: 10, name: 'Hannah Irving', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'hannah@example.com' },
    { id: 11, name: 'Ian Jackson', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'ian@example.com' },
    { id: 12, name: 'Julia King', profileImage: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png', email: 'julia@example.com' }
  ];

  ngOnInit() {
    this.filteredUsers = this.allUsers;
  }

  selectChat(chat: Chat) {
    this.selectedChat = chat;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.selectedChat.messages.push({
        user: this.username,
        text: this.newMessage,
        timestamp: new Date()
      });
      this.newMessage = '';
    }
  }

  filterChats() {
    this.filteredChats = this.chats.filter(chat => 
      chat.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openNewConversationPopup() {
    this.showNewConversationPopup = true;
  }

  closeNewConversationPopup() {
    this.showNewConversationPopup = false;
  }

  filterUsers() {
    this.filteredUsers = this.allUsers.filter(user =>
      user.name.toLowerCase().includes(this.newConversationSearchTerm.toLowerCase())
    );
  }

  startConversation(user: User) {
    this.closeNewConversationPopup();
  }
}

interface User {
  id: number;
  name: string;
  profileImage: string;
  email: string;
}

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
}