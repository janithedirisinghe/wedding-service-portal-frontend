import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Login } from '../Models/login.model';
import { default as jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // Change this to your backend URL

  constructor(private http: HttpClient, private router: Router) {}

  // Login function
  login(login: Login): Observable<any> {
    return this.http.post<{ role: string; userId: number; token: string; username: string }>(
      `${this.apiUrl}/login`, 
      login
    ).pipe(
      tap((response) => {
        this.storeUserData(response);
        this.redirectUser(response.role);
      })
    );
  }

  // Store user data in localStorage
  private storeUserData(response: {
    role: string;
    userId: number;
    token: string;
    username: string;
  }) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role);
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('username', response.username);
  }

  // Logout function
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get the token
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      console.log('localStorage is available', localStorage);
      return localStorage.getItem('token'); 
    } else {
      console.warn('localStorage is not available');
      return null;
    }
  }

  // Get the role of the logged-in user
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  // isTokenExpired(): boolean {
  //   const token = this.getToken();
  //   if (!token) return true;
  
  //   // const decodedToken: any = jwtDecode(token.replace('Bearer, ', ''));
  //   // const exp = decodedToken.exp * 1000;
  //   // return Date.now() > exp;
  // }

  // Redirect user based on role
  redirectUser(role: string) {
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
