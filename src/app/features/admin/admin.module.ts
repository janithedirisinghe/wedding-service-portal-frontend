import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminBodyPageComponent } from './admin-body-page/admin-body-page.component';
@NgModule({
declarations: [


  
    AdminBodyPageComponent
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