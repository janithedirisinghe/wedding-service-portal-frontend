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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthService } from '../../shared/services/auth.service';


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
    AuthRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule



],
  exports: [
    
  ]
})
export class AuthModule { }