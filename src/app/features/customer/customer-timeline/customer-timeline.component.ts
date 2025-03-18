import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-timeline',
  templateUrl: './customer-timeline.component.html',
  styleUrl: './customer-timeline.component.scss'
})
export class CustomerTimelineComponent {
  vendor: any; // Add this line to define the vendor property
  timelineData = [
    {
      image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      name: 'Bonnie',
      action: 'moved',
      target: 'Jese Leos',
      targetUrl: '#',
      status: 'Funny Group',
      time: 'just now',
      images: ['/assets/images/post1.jpg', '/assets/images/post2.jpg', '/assets/images/post3.jpg'],
      isFollowing: false
    },
    {
      image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      name: 'Thomas Lean',
      action: 'commented on',
      target: 'Flowbite Pro',
      targetUrl: '#',
      time: '2 hours ago',
      message: "Hi ya'll! I wanted to share a webinar zeroheight is having regarding how to best measure your design system!",
      images: ['/assets/images/post4.jpg'],
      isFollowing: false
    },
    {
      image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      name: 'Jese Leos',
      action: 'has changed',
      target: 'Pricing page',
      targetUrl: '#',
      status: 'Finished',
      time: '1 day ago',
      images: ['/assets/images/post5.jpg', '/assets/images/post6.jpg'],
      isFollowing: false
    }
  ];
  
  toggleFollow(event: any) {
    event.isFollowing = !event.isFollowing;
  }
}
