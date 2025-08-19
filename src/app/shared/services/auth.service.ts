import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
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

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize auth state from localStorage on service creation
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Try to restore from localStorage
      const storedUser = localStorage.getItem('userSession');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          this.userData = parsedUser; 
        } catch (e) {
          // If parsing fails, remove invalid data
          localStorage.removeItem('userSession');
        }
      }
    } 
  }

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
        // Store session info in localStorage for persistence across refreshes
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('userSession', JSON.stringify(this.userData));
        }
        this.redirectUser(response.role);
      })
    );
  }

  // Method to validate current session with backend (optional)
  validateSession(): Observable<boolean> {
    // This method can be called periodically to validate the session
    // For now, it just checks if localStorage has session data
    return of(this.isLoggedIn());
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.clearAuthState();
        this.router.navigate(['/auth/customer-login']);
      },
      error: () => {
        // Even if logout request fails, clear local state
        this.clearAuthState();
        this.router.navigate(['/auth/customer-login']);
      }
    });
  }

  private clearAuthState(): void {
    this.userData = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userSession');
    }
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
        this.router.navigate(['/customer/timeline']);
        break; 
      default:
        this.router.navigate(['/auth/customer-login']);
        break;
    }
  }
}
