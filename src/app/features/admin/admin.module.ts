import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminBodyPageComponent } from './admin-body-page/admin-body-page.component';
import { VendorManagementComponent } from './vendor-management/vendor-management.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { VendorTypeManagementComponent } from './vendor-type-management/vendor-type-management.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AdminHelpSupportComponent } from './admin-help-support/admin-help-support.component';
import { AdminNotificationsComponent } from './admin-notifications/admin-notifications.component';
import { VendorEarningsComponent } from './vendor-earnings/vendor-earnings.component';

@NgModule({
  declarations: [
    AdminBodyPageComponent,
    VendorManagementComponent,
    AdminDashboardComponent,
    CustomerManagementComponent,
    VendorTypeManagementComponent,
    AdminProfileComponent,
    AdminHelpSupportComponent,
    AdminNotificationsComponent,
    VendorEarningsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule
  ],
  exports: [

  ]
})
export class AdminModule { }