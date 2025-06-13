import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBodyPageComponent } from './admin-body-page/admin-body-page.component';

const routes: Routes = [
    { path: '', component: AdminBodyPageComponent, 
      children: [
      ]
    }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }