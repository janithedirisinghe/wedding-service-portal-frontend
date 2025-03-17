import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerBodyPageComponent } from './customer-body-page/customer-body-page.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerTimelineComponent } from './customer-timeline/customer-timeline.component';

@NgModule({
declarations: [
  
    CustomerBodyPageComponent,
        CustomerTimelineComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    CustomerRoutingModule
],
  exports: [
    
  ]
})
export class CustomerModule { }