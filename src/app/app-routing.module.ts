import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('../app/features/home/home.module').then(m => m.HomeModule) },
  { path: 'vender', loadChildren: () => import('../app/features/vender/vender.module').then(m => m.VenderModule) },
  { path: 'auth', loadChildren: () => import('../app/features/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
