import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeLandingPageComponent } from './home-landing-page/home-landing-page.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { TabViewModule } from 'primeng/tabview';
import { GetStartPageComponent } from './get-start-page/get-start-page.component';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';

@NgModule({
declarations: [
    HomeLandingPageComponent,
    GetStartPageComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    TabViewModule,
    FieldsetModule,
    ButtonModule
],
  exports: [
    
  ]
})
export class HomeModule { }