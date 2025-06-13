import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  profile: any;

  constructor() { }

  ngOnInit(): void {
    this.loadDummyData();
  }
  loadDummyData(): void {
    this.profile = {
      firstName: 'John',
      lastName: 'Doe',
      position: 'Client',
      location: 'New York, NY',
      socialLinks: {
        facebook: 'https://facebook.com/johndoe',
        twitter: 'https://twitter.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        instagram: 'https://instagram.com/johndoe'
      },
      email: 'john.doe@example.com',
      phone: '+1 (234) 567-890',
      bio: 'Passionate about creating memorable wedding experiences. I enjoy working with talented vendors to bring dream weddings to life.'
    };
  }
}
