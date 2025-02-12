import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { AuthRoutingModule } from './auth-routing.module';
import { VenderRegisterComponent } from './vender-register/vender-register.component';
import { VenderLoginComponent } from './vender-login/vender-login.component';
import { AuthPageBodyComponent } from './auth-page-body/auth-page-body.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { CustomerRegisterComponent } from './customer-register/customer-register.component';


@NgModule({
declarations: [
  
    VenderRegisterComponent,
    VenderLoginComponent,
    AuthPageBodyComponent,
    CustomerLoginComponent,
    CustomerRegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule

],
  exports: [
    
  ]
})
export class AuthModule { }