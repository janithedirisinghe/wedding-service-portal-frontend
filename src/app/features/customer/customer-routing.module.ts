import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerBodyPageComponent } from './customer-body-page/customer-body-page.component';
import { CustomerTimelineComponent } from './customer-timeline/customer-timeline.component';
import { VenderProfileCustomerComponent } from './vender-profile-customer/vender-profile-customer.component';


const routes: Routes = [
    { path: '', component: CustomerBodyPageComponent, 
      children: [
        {path : 'timeline', component: CustomerTimelineComponent},
        {path : 'vender-profile', component: VenderProfileCustomerComponent},
      ]
    }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }