import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerBodyPageComponent } from './customer-body-page/customer-body-page.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerTimelineComponent } from './customer-timeline/customer-timeline.component';
import { VenderProfileCustomerComponent } from './vender-profile-customer/vender-profile-customer.component';
import { VenderPostlistCustomerComponent } from './vender-postlist-customer/vender-postlist-customer.component';
import { CustomerChatComponent } from './customer-chat/customer-chat.component';
import { BrowserModule } from '@angular/platform-browser';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';

@NgModule({
declarations: [
  
    CustomerBodyPageComponent,
        CustomerTimelineComponent,
        VenderProfileCustomerComponent,
        VenderPostlistCustomerComponent,
        CustomerChatComponent,
        CustomerProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    FormsModule
], 
  exports: [
    
  ]
})
export class CustomerModule { }