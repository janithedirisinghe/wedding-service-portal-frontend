import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { AuthRoutingModule } from './auth-routing.module';
import { VenderRegisterComponent } from './vender-register/vender-register.component';
import { VenderLoginComponent } from './vender-login/vender-login.component';
import { AuthPageBodyComponent } from './auth-page-body/auth-page-body.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { CustomerRegisterComponent } from './customer-register/customer-register.component';
import { RegisterBusinessInfoComponent } from './register-business-info/register-business-info.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { RegisterVenderInfoComponent } from './register-vender-info/register-vender-info.component';


@NgModule({
declarations: [
  
    VenderRegisterComponent,
    VenderLoginComponent,
    AuthPageBodyComponent,
    CustomerLoginComponent,
    CustomerRegisterComponent,
    RegisterBusinessInfoComponent,
    OtpVerificationComponent,
    RegisterVenderInfoComponent
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