import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { VenderBodyPageComponent } from './vender-body-page/vender-body-page.component';
import { VenderRoutingModule } from './vender-routing.module';
import { VenderSidebarComponent } from '../../shared/components/vender-sidebar/vender-sidebar.component';
import { VenderPostsPageComponent } from './vender-posts-page/vender-posts-page.component';
import { VenderCalenderComponent } from './vender-calender/vender-calender.component';
import { VenderMeetingRequstsComponent } from './vender-meeting-requsts/vender-meeting-requsts.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { VenderServiceFormComponent } from './vender-service-form/vender-service-form.component';
import { VenderServiceTableComponent } from './vender-service-table/vender-service-table.component';

@NgModule({
declarations: [
    VenderBodyPageComponent,
    VenderPostsPageComponent,
    VenderCalenderComponent,
    VenderMeetingRequstsComponent,
    VenderServiceFormComponent,
    VenderServiceTableComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    VenderRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
],
  exports: [
    
  ]
})
export class VenderModule { }