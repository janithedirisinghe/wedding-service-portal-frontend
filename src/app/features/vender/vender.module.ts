import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { VenderBodyPageComponent } from './vender-body-page/vender-body-page.component';
import { VenderRoutingModule } from './vender-routing.module';
import { VenderSidebarComponent } from '../../shared/components/vender-sidebar/vender-sidebar.component';
import { VenderPostsPageComponent } from './vender-posts-page/vender-posts-page.component';

@NgModule({
declarations: [
    VenderBodyPageComponent,
    VenderPostsPageComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    VenderRoutingModule
],
  exports: [
    
  ]
})
export class VenderModule { }