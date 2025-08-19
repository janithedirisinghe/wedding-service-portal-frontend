# Notification System Integration Guide

This document explains how to integrate the notification system with your backend API in the Wedding Service Portal Frontend.

## Overview

The notification system consists of several components that work together to provide real-time notifications for users:

1. **NotificationModel** - TypeScript interfaces and enums
2. **NotificationService** - Service to interact with backend API
3. **NotificationIconComponent** - Icon with unread count badge
4. **NotificationPanelComponent** - Full notification list panel
5. **NotificationDropdownComponent** - Combined dropdown component
6. **NavbarWithNotificationsComponent** - Example navbar integration

## Notification Types and Navigation

The system supports the following notification types with automatic navigation:

### Booking Notifications
- `BOOKING_REQUEST` - New booking request received
- `BOOKING_ACCEPTED` - Booking has been accepted  
- `BOOKING_REJECTED` - Booking has been rejected
- `BOOKING_CANCELLED` - Booking has been cancelled
- `BOOKING_COMPLETED` - Booking has been completed

### Meeting Notifications  
- `MEETING_REQUEST` - New meeting request
- `MEETING_ACCEPTED` - Meeting request accepted
- `MEETING_REJECTED` - Meeting request rejected
- `MEETING_CANCELLED` - Meeting has been cancelled
- `MEETING_REMINDER` - Upcoming meeting reminder

### Payment Notifications
- `PAYMENT_RECEIVED` - Payment has been received
- `PAYMENT_PENDING` - Payment is pending
- `PAYMENT_FAILED` - Payment has failed

### Social Notifications
- `REVIEW_RECEIVED` - New review received
- `FOLLOW_REQUEST` - New follow request

### System Notifications
- `SYSTEM_ANNOUNCEMENT` - System-wide announcements
- `GENERAL` - General notifications

### Priority Levels
- `LOW` - Low priority (gray border)
- `NORMAL` - Normal priority (blue border)  
- `HIGH` - High priority (orange border)
- `URGENT` - Urgent priority (red border)

## Setup Instructions

### 1. Import Components

Since the notification components are standalone, you can import them directly where needed:

```typescript
// In your component
import { NotificationDropdownComponent } from 'path/to/notification-dropdown.component';
import { NotificationIconComponent } from 'path/to/notification-icon.component';
import { NotificationPanelComponent } from 'path/to/notification-panel.component';

@Component({
  // ...
  imports: [NotificationDropdownComponent],
  // ...
})
```

### 2. Add to Template

#### Option A: Full Dropdown (Recommended)
```html
<app-notification-dropdown></app-notification-dropdown>
```

#### Option B: Separate Icon and Panel
```html
<app-notification-icon (toggleNotificationPanel)="togglePanel()"></app-notification-icon>

<div *ngIf="showPanel">
  <app-notification-panel (notificationClick)="onNotificationClick($event)"></app-notification-panel>
</div>
```

### 3. Integration Examples

#### Customer Header Integration
Update `customer-header.component.html`:
```html
<div class="bg-white shadow-md mb-6 border-b-2 border-blue-200 rounded-md overflow-hidden">
  <div class="container mx-auto px-6 py-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div class="flex flex-col gap-2 border-l-4 border-blue-500 pl-4">
        <h1 class="text-2xl font-bold text-gray-900 transition-all duration-300 hover:text-blue-600">{{ pageTitle }}</h1>
        <p *ngIf="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>
      <div class="mt-3 md:mt-0 flex items-center space-x-4">
        <!-- Add notifications here -->
        <app-notification-dropdown></app-notification-dropdown>
        <ng-content></ng-content>
      </div>
    </div>
  </div>
</div>
```

Update `customer-header.component.ts`:
```typescript
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationDropdownComponent } from '../notification-dropdown/notification-dropdown.component';

@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.scss'],
  standalone: true,
  imports: [CommonModule, NotificationDropdownComponent]
})
export class CustomerHeaderComponent implements OnInit {
  @Input() pageTitle: string = '';
  @Input() subtitle: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }
}
```

#### Vendor Header Integration
Similar integration can be done for vendor header by adding the notification dropdown component.

### 4. Service Usage

#### Get Notifications
```typescript
constructor(private notificationService: NotificationService) {}

loadNotifications() {
  this.notificationService.getUserNotifications(0, 20).subscribe({
    next: (response) => {
      console.log('Notifications:', response.content);
    },
    error: (error) => {
      console.error('Error loading notifications:', error);
    }
  });
}
```

#### Mark as Read
```typescript
markAsRead(notificationId: number) {
  this.notificationService.markAsRead(notificationId).subscribe({
    next: () => {
      console.log('Marked as read');
    },
    error: (error) => {
      console.error('Error marking as read:', error);
    }
  });
}
```

#### Subscribe to Real-time Updates
```typescript
ngOnInit() {
  // Subscribe to unread count changes
  this.notificationService.unreadCount$.subscribe(count => {
    console.log('Unread count:', count);
  });

  // Subscribe to notification list changes
  this.notificationService.notifications$.subscribe(notifications => {
    console.log('Notifications updated:', notifications);
  });
}
```

## Backend API Endpoints Required

### 1. Get User Notifications (Implemented)
```
GET /api/notifications/user/{userId}?page=0&size=20
```

### 2. Mark as Read (To be implemented)
```
PATCH /api/notifications/{notificationId}/read
```

### 3. Mark Multiple as Read (To be implemented)
```
PATCH /api/notifications/mark-read
Body: { "notificationIds": [1, 2, 3] }
```

### 4. Mark All as Read (To be implemented)
```
PATCH /api/notifications/user/{userId}/mark-all-read
```

### 5. Delete Notification (To be implemented)
```
DELETE /api/notifications/{notificationId}
```

### 6. Get Unread Count (To be implemented)
```
GET /api/notifications/user/{userId}/unread-count
Response: { "count": 5 }
```

## Styling

The components use Tailwind CSS classes. You can customize the appearance by:

1. **Modifying component styles directly**
2. **Adding custom CSS classes**
3. **Using Tailwind configuration**

Example custom styles:
```scss
// Custom notification styles
.notification-panel {
  @apply bg-white rounded-lg shadow-xl border border-gray-200;
}

.notification-item.priority-urgent {
  @apply bg-red-50 border-l-4 border-l-red-500;
}

.notification-badge {
  @apply bg-red-500 text-white text-xs font-bold rounded-full animate-pulse;
}
```

## Error Handling

The service includes comprehensive error handling:

```typescript
// Error handling example
this.notificationService.getUserNotifications().subscribe({
  next: (response) => {
    // Handle success
  },
  error: (error) => {
    if (error.status === 401) {
      // Handle unauthorized
      this.router.navigate(['/login']);
    } else if (error.status === 500) {
      // Handle server error
      this.showErrorMessage('Server error occurred');
    }
  }
});
```

## Real-time Updates (Future Enhancement)

For real-time notifications, consider implementing WebSocket or SSE:

```typescript
// Example WebSocket integration
connectToNotifications() {
  const socket = new WebSocket('ws://localhost:8080/notifications');
  
  socket.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    // Update local state
    this.notificationService.addNewNotification(notification);
  };
}
```

## Testing

### Unit Tests
```typescript
// Example test
describe('NotificationService', () => {
  it('should fetch user notifications', () => {
    const mockResponse = { content: [], totalElements: 0 };
    httpMock.expectOne('http://localhost:8080/api/notifications/user/1')
      .flush(mockResponse);
    
    service.getUserNotifications().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  });
});
```

### Integration Tests
Test the complete notification flow including API calls and UI updates.

## Performance Considerations

1. **Pagination** - Use pagination for large notification lists
2. **Caching** - Cache recent notifications to reduce API calls
3. **Debouncing** - Debounce mark-as-read operations
4. **Virtual Scrolling** - For very large notification lists

## Security

1. **Authentication** - Ensure user is authenticated before accessing notifications
2. **Authorization** - Users can only access their own notifications
3. **Input Validation** - Validate all user inputs
4. **XSS Prevention** - Sanitize notification content if it contains HTML

## Deployment

1. **Build** - Ensure all notification components are included in the build
2. **Environment** - Configure API URLs for different environments
3. **Monitoring** - Monitor notification API performance and error rates
