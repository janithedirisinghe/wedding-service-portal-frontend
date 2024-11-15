import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLandingPageComponent } from './home-landing-page/home-landing-page.component';
import { GetStartPageComponent } from './get-start-page/get-start-page.component';

const routes: Routes = [
  { path: '', component: HomeLandingPageComponent },
  { path: 'get-start', component: GetStartPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }