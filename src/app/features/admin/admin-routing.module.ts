import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBodyPageComponent } from './admin-body-page/admin-body-page.component';
import { VendorManagementComponent } from './vendor-management/vendor-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { VendorTypeManagementComponent } from './vendor-type-management/vendor-type-management.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AdminHelpSupportComponent } from './admin-help-support/admin-help-support.component';
import { AdminNotificationsComponent } from './admin-notifications/admin-notifications.component';
import { VendorEarningsComponent } from './vendor-earnings/vendor-earnings.component';
import { AdminGuard } from '../../shared/guards/admin.guard';

const routes: Routes = [
    { path: '', component: AdminBodyPageComponent, 
      canActivate: [AdminGuard],
      children: [
        { path: '', component: AdminDashboardComponent }, // Default route
        { path: 'dashboard', component: AdminDashboardComponent },
        { path: 'vendor-management', component: VendorManagementComponent },
        { path: 'customer-management', component: CustomerManagementComponent },
        { path: 'vendor-type-management', component: VendorTypeManagementComponent },
        { path: 'vendor-earnings', component: VendorEarningsComponent },
        { path: 'profile', component: AdminProfileComponent },
        { path: 'help-support', component: AdminHelpSupportComponent },
        { path: 'notifications', component: AdminNotificationsComponent },
      ]
    },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }