import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminBodyPageComponent } from './admin-body-page/admin-body-page.component';
import { VendorManagementComponent } from './vendor-management/vendor-management.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@NgModule({
declarations: [
    AdminBodyPageComponent,
    VendorManagementComponent,
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    ReactiveFormsModule,
    AdminRoutingModule
],
  exports: [
    
  ]
})
export class AdminModule { }