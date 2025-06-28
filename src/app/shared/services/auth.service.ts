import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Login } from '../Models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // Spring Boot backend

  private userData: {
    role: string;
    userId: number;
    username: string;
  } | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  login(login: Login): Observable<any> {
    return this.http.post<{ role: string; userId: number; username: string }>(
      `${this.apiUrl}/login`,
      login,
      { withCredentials: true } // Send/receive HttpOnly cookie
    ).pipe(
      tap(response => {
        this.userData = {
          role: response.role,
          userId: response.userId,
          username: response.username
        };
        this.redirectUser(response.role);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.userData = null;
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn(): boolean {
    return !!this.userData;
  }

  getUserRole(): string | null {
    return this.userData?.role || null;
  }

  getUserId(): number | null {
    return this.userData?.userId || null;
  }

  getUserName(): string | null {
    return this.userData?.username || null;
  }

  redirectUser(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'VENDOR':
        this.router.navigate(['/vender']);
        break;
      case 'CUSTOMER':
        this.router.navigate(['/customer/home']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}
