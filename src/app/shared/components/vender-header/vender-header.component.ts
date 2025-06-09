import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vender-header',
  templateUrl: './vender-header.component.html',
  styleUrls: ['./vender-header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class VenderHeaderComponent implements OnInit {
  @Input() pageTitle: string = '';
  @Input() subtitle: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }
}