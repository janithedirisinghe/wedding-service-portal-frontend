import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomerBodyPageComponent } from './customer-body-page/customer-body-page.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerTimelineComponent } from './customer-timeline/customer-timeline.component';
import { VenderProfileCustomerComponent } from './vender-profile-customer/vender-profile-customer.component';
import { VenderPostlistCustomerComponent } from './vender-postlist-customer/vender-postlist-customer.component';

@NgModule({
declarations: [
  
    CustomerBodyPageComponent,
        CustomerTimelineComponent,
        VenderProfileCustomerComponent,
        VenderPostlistCustomerComponent
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