import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeNavbarComponent } from './components/home-navbar/home-navbar.component';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { HomeFooterComponent } from './components/home-footer/home-footer.component';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { VenderSidebarComponent } from './components/vender-sidebar/vender-sidebar.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { AuthService } from './services/auth.service';
import { CustomerToolbarComponent } from './components/customer-toolbar/customer-toolbar.component';

// Import shared services

@NgModule({
  declarations: [
    HomeNavbarComponent,
    HomeFooterComponent,
    MainNavbarComponent,
    VenderSidebarComponent,
    FileUploaderComponent,
    CustomerToolbarComponent,
  ],
  imports: [
    CommonModule,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    PanelMenuModule,
  ],
  exports: [
    HomeNavbarComponent,
    HomeFooterComponent,
    MainNavbarComponent,
    VenderSidebarComponent,
    FileUploaderComponent,
    CustomerToolbarComponent,
  ],
  providers: [],
})
export class SharedModule {}
