import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VenderBodyPageComponent } from './vender-body-page/vender-body-page.component';
import { VenderPostsPageComponent } from './vender-posts-page/vender-posts-page.component';
import { VenderServiceFormComponent } from './vender-service-form/vender-service-form.component';
import { VenderCalenderComponent } from './vender-calender/vender-calender.component';
import { VenderMeetingRequstsComponent } from './vender-meeting-requsts/vender-meeting-requsts.component';
import { VenderBookingRequestsComponent } from './vender-booking-requests/vender-booking-requests.component';
import { VenderProfileComponent } from './vender-profile/vender-profile.component';
import { VenderServiceTableComponent } from './vender-service-table/vender-service-table.component';
import { VenderChatComponent } from './vender-chat/vender-chat.component';
import { VenderHelpSupportComponent } from './vender-help-support/vender-help-support.component';

const routes: Routes = [
    { path: '', component: VenderBodyPageComponent, 
      children: [
        { path: '', redirectTo: 'posts', pathMatch: 'full' }, // Default route
        { path: 'posts', component: VenderPostsPageComponent},
        { path: 'createService', component: VenderServiceFormComponent},
        { path: 'eventCalender', component: VenderCalenderComponent},
        { path: 'meetingRequests', component: VenderMeetingRequstsComponent},
        { path: 'bookingRequests', component: VenderBookingRequestsComponent},
        { path: 'profile', component: VenderProfileComponent },
        { path: 'serviceList', component: VenderServiceTableComponent},
  { path: 'chat', component: VenderChatComponent },
        { path: 'help-support', component: VenderHelpSupportComponent },
        { path: '**', redirectTo: 'posts' } // Wildcard route for invalid vendor routes
      ]
    }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenderRoutingModule { }