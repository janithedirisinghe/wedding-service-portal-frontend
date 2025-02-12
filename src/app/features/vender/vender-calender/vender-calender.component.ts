import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vender-calender',
  templateUrl: './vender-calender.component.html',
  styleUrls: ['./vender-calender.component.scss']
})
export class VenderCalenderComponent implements OnInit {
  currentMonth: Date;
  weeks: any[] = [];
  events: { [key: string]: string[] } = {};

  constructor() {
    this.currentMonth = new Date();
  }

  ngOnInit() {
    this.generateCalendar();
    this.generateDummyEvents();
  }

  generateCalendar() {
    const startOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const weeks = [];
    let currentWeek = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      currentWeek.push(new Date(currentDate));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.weeks = weeks;
  }

  generateDummyEvents() {
    const eventTitles = ['Wedding', 'Meeting', 'Birthday', 'Anniversary', 'Conference'];
    this.weeks.forEach(week => {
      week.forEach((day: Date) => {
        if (Math.random() > 0.7) { // 30% chance to have an event
          const dateKey = day.toISOString().split('T')[0];
          this.events[dateKey] = [eventTitles[Math.floor(Math.random() * eventTitles.length)]];
        }
      });
    });
  }

  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.generateCalendar();
    this.generateDummyEvents();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.generateCalendar();
    this.generateDummyEvents();
  }
}
