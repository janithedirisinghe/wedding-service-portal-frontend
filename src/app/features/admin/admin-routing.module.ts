import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBodyPageComponent } from './admin-body-page/admin-body-page.component';
import { VendorManagementComponent } from './vendor-management/vendor-management.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const routes: Routes = [
    { path: '', component: AdminBodyPageComponent, 
      children: [
        { path: '', component: AdminDashboardComponent }, // Default route
        { path: 'dashboard', component: AdminDashboardComponent },
        { path: 'vendor-management', component: VendorManagementComponent },
      ]
    }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }