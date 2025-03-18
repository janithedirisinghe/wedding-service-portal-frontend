import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vender-profile-customer',
  templateUrl: './vender-profile-customer.component.html',
  styleUrls: ['./vender-profile-customer.component.scss']
})
export class VenderProfileCustomerComponent implements OnInit {
  vendor: any;
  reviews: any[] = [];
  selectedTab: string = 'posts';

  ngOnInit(): void {
    this.vendor = {
      businessName: 'Vendor Business Name',
      bio: 'This is a short bio of the vendor.',
      location: 'City, State',
      country: 'Country',
      telNo: '123-456-7890',
      services: [
        { name: 'Service 1', description: 'Description for service 1', pricing: 100 },
        { name: 'Service 2', description: 'Description for service 2', pricing: 200 },
        { name: 'Service 3', description: 'Description for service 3', pricing: 300 }
      ]
    };

    this.reviews = [
      { name: 'John Doe', location: 'City, State', date: '2023-01-01', rating: 4.5, text: 'Great service!' },
      { name: 'Jane Smith', location: 'City, State', date: '2023-02-01', rating: 4.0, text: 'Very satisfied!' },
      { name: 'Alice Johnson', location: 'City, State', date: '2023-03-01', rating: 5.0, text: 'Highly recommend!' }
    ];
  }
}
