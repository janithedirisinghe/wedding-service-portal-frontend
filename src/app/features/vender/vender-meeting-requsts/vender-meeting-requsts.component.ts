import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vender-meeting-requsts',
  templateUrl: './vender-meeting-requsts.component.html',
  styleUrls: ['./vender-meeting-requsts.component.scss'],
})
export class VenderMeetingRequstsComponent implements OnInit {
  Math = Math;
  meetingRequests: { id: number; date: string; userName: string }[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  ngOnInit() {
    this.fetchMeetingRequests();
  }

  fetchMeetingRequests() {
    // Simulate fetching data from an API
    const dummyData = [
      { id: 1, date: '16th May 2025 | 12:00 PM', userName: 'User 1' },
      { id: 2, date: '17th May 2025 | 1:00 PM', userName: 'User 2' },
      { id: 3, date: '18th May 2025 | 2:00 PM', userName: 'User 3' },
      { id: 4, date: '19th May 2025 | 3:00 PM', userName: 'User 4' },
      { id: 5, date: '20th May 2025 | 4:00 PM', userName: 'User 5' },
      { id: 6, date: '21st May 2025 | 5:00 PM', userName: 'User 6' },
      { id: 7, date: '22nd May 2025 | 6:00 PM', userName: 'User 7' },
      { id: 8, date: '23rd May 2025 | 7:00 PM', userName: 'User 8' },
      { id: 9, date: '24th May 2025 | 8:00 PM', userName: 'User 9' },
      { id: 10, date: '25th May 2025 | 9:00 PM', userName: 'User 10' },
      { id: 11, date: '26th May 2025 | 10:00 PM', userName: 'User 11' },
      { id: 12, date: '27th May 2025 | 11:00 PM', userName: 'User 12' },
      { id: 13, date: '28th May 2025 | 12:00 PM', userName: 'User 13' },
      { id: 14, date: '29th May 2025 | 1:00 PM', userName: 'User 14' },
      { id: 15, date: '30th May 2025 | 2:00 PM', userName: 'User 15' },
      { id: 16, date: '31st May 2025 | 3:00 PM', userName: 'User 16' },
      { id: 17, date: '1st June 2025 | 4:00 PM', userName: 'User 17' },
      { id: 18, date: '2nd June 2025 | 5:00 PM', userName: 'User 18' },
      { id: 19, date: '3rd June 2025 | 6:00 PM', userName: 'User 19' },
      { id: 20, date: '4th June 2025 | 7:00 PM', userName: 'User 20' },
    ];
    this.meetingRequests = dummyData;
    this.totalItems = this.meetingRequests.length;
  }

  get paginatedRequests() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.meetingRequests.slice(start, end);
  }

  changePage(page: number) {
    if (page > 0 && page <= Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage = page;
    }
  }
}
