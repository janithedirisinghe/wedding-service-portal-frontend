import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerBodyPageComponent } from './customer-body-page/customer-body-page.component';
import path from 'path';
import { CustomerTimelineComponent } from './customer-timeline/customer-timeline.component';


const routes: Routes = [
    { path: '', component: CustomerBodyPageComponent, 
      children: [
        {path : 'timeline', component: CustomerTimelineComponent}
      ]
    }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }