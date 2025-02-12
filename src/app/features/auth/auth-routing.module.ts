import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VenderRegisterComponent } from './vender-register/vender-register.component';
import { AuthPageBodyComponent } from './auth-page-body/auth-page-body.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { CustomerRegisterComponent } from './customer-register/customer-register.component';
import { VenderLoginComponent } from './vender-login/vender-login.component';

const routes: Routes = [
  {
    path: '',
    component: AuthPageBodyComponent,
    children: [
      { path: 'vender-register', component: VenderRegisterComponent },
      { path: 'customer-login', component: CustomerLoginComponent },
      { path: 'customer-register', component: CustomerRegisterComponent },
      { path: 'vender-login', component: VenderLoginComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
