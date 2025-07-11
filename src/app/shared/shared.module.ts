import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeNavbarComponent } from './components/home-navbar/home-navbar.component';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { HomeFooterComponent } from './components/home-footer/home-footer.component';
import { MainNavbarComponent } from './components/main-navbar/main-navbar.component';
import { VenderSidebarComponent } from './components/vender-sidebar/vender-sidebar.component';
import { SidebarTwoComponent } from './components/sidebar-two/sidebar-two.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { AuthService } from './services/auth.service';
import { CustomerToolbarComponent } from './components/customer-toolbar/customer-toolbar.component';
import { VenderHeaderComponent } from './components/vender-header/vender-header.component';
import { CustomerHeaderComponent } from './components/customer-header/customer-header.component';
import { NavbartwoComponent } from './components/navbartwo/navbartwo.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { PreventDefaultDirective } from './directives/prevent-default.directive';

// Import shared services

@NgModule({  declarations: [
    HomeNavbarComponent,
    HomeFooterComponent,
    MainNavbarComponent,
    VenderSidebarComponent,
    FileUploaderComponent,
    CustomerToolbarComponent,
    SidebarTwoComponent,
    NavbartwoComponent,
    AdminSidebarComponent,
    AdminNavbarComponent,
    PreventDefaultDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule,
    PanelMenuModule,
    VenderHeaderComponent,
    CustomerHeaderComponent,
  ],  exports: [
    HomeNavbarComponent,
    HomeFooterComponent,
    MainNavbarComponent,
    VenderSidebarComponent,
    SidebarTwoComponent,
    NavbartwoComponent,
    FileUploaderComponent,
    CustomerToolbarComponent,
    VenderHeaderComponent,
    CustomerHeaderComponent,
    AdminSidebarComponent,
    AdminNavbarComponent,
    PreventDefaultDirective,
  ],
  providers: [],
})
export class SharedModule {}
