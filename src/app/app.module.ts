import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './features/home/home.module';
import { VenderModule } from './features/vender/vender.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    OrganizationChartModule,
    SharedModule,
    HomeModule,
    VenderModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
