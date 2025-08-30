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

@NgModule({
declarations: [
    AdminBodyPageComponent,
    VendorManagementComponent,
    AdminDashboardComponent,
    CustomerManagementComponent,
    VendorTypeManagementComponent
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