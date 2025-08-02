import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerBodyPageComponent } from './customer-body-page/customer-body-page.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerTimelineComponent } from './customer-timeline/customer-timeline.component';
import { VenderProfileCustomerComponent } from './vender-profile-customer/vender-profile-customer.component';
import { CustomerChatComponent } from './customer-chat/customer-chat.component';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { EditProfileModalComponent } from './customer-profile/edit-profile-modal/edit-profile-modal.component';
import { VendorFollowButtonComponent } from './components/vendor-follow-button/vendor-follow-button.component';
import { VendorSearchComponent } from './vendor-search/vendor-search.component';
import { CustomerFavoritesComponent } from './customer-favorites/customer-favorites.component';

@NgModule({
  declarations: [
    CustomerBodyPageComponent,
    CustomerTimelineComponent,
    VenderProfileCustomerComponent,
    CustomerChatComponent,
    CustomerProfileComponent,
    EditProfileModalComponent,
    VendorFollowButtonComponent,
    VendorSearchComponent,
    CustomerFavoritesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    FormsModule
  ], 
  exports: [
    VendorFollowButtonComponent
  ]
})
export class CustomerModule { }