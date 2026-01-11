import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return this.authService.waitForAuthInitialization().pipe(
      map(isLoggedIn => {
        if (isLoggedIn && this.authService.getUserRole() === 'ADMIN') {
          return true;
        } else {
          this.router.navigate(['/auth/admin-login']);
          return false;
        }
      })
    );
  }
}
