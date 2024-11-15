import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VenderBodyPageComponent } from './vender-body-page/vender-body-page.component';
import { VenderPostsPageComponent } from './vender-posts-page/vender-posts-page.component';
const routes: Routes = [
    { path: '', component: VenderBodyPageComponent, 
      children: [
        { path: 'posts', component: VenderPostsPageComponent}
      ]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenderRoutingModule { }