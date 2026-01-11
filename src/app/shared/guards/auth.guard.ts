import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, map, filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // Wait for auth initialization to complete
    return this.authService.authInitialized$.pipe(
      filter(initialized => initialized),
      take(1),
      map(() => {
        if (!this.authService.isLoggedIn()) {
          this.router.navigate(['/auth/customer-login']);
          return false;
        }

        const requiredRole = route.url[0]?.path;
        const userRole = this.authService.getUserRole()?.toLowerCase();

        if (requiredRole && requiredRole !== userRole) {
          this.router.navigate(['/auth/customer-login']);
          return false;
        }

        return true;
      })
    );
  }
}
