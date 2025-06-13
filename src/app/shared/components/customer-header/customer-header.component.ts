import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CustomerHeaderComponent implements OnInit {
  @Input() pageTitle: string = '';
  @Input() subtitle: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }
}
