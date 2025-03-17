import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.url[0]?.path;
    const userRole = this.authService.getUserRole()?.toLowerCase();

    if (requiredRole && requiredRole !== userRole) {
      this.router.navigate(['/login']); // Redirect unauthorized users
      return false;
    }

    return true;
  }
  
}
