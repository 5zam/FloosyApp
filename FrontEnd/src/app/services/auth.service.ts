import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest, AppUser } from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  
  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }
  
  private initializeAuth(): void {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.tokenSubject.next(token);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearAuthData();
      }
    }
  }
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('Attempting login with:', credentials.email);
    console.log('API URL:', this.API_URL);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          // Handle both uppercase and lowercase token properties
          const token = response.token || response.Token;
          if (token && response.success !== false) {
            this.setAuthData(token, response.user);
          }
        }),
        catchError(error => this.handleError(error, 'Login'))
      );
  }
  
  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log('Attempting registration with:', userData.email);
    
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData)
      .pipe(
        tap(response => {
          console.log('Registration response:', response);
        }),
        catchError(error => this.handleError(error, 'Registration'))
      );
  }
  
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  
  getToken(): string | null {
    return this.tokenSubject.value || localStorage.getItem('auth_token');
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = this.decodeJWTPayload(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      this.clearAuthData();
      return false;
    }
  }
  
  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }
  
  private setAuthData(token: string, user?: AppUser): void {
    localStorage.setItem('auth_token', token);
    this.tokenSubject.next(token);
    
    let userData: AppUser;
    
    if (user) {
      userData = user;
    } else {
      // Decode JWT to extract user info
      try {
        const payload = this.decodeJWTPayload(token);
        userData = {
          id: payload.sub || payload.nameid || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 'unknown',
          userName: payload.unique_name || payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
          email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
          fullName: payload.FullName || payload.given_name || payload.name || 'User',
          emailConfirmed: true
        };
      } catch (error) {
        console.error('Error decoding JWT:', error);
        // Fallback user data
        userData = {
          id: 'temp-id',
          userName: 'user',
          email: 'user@example.com',
          fullName: 'User',
          emailConfirmed: true
        };
      }
    }
    
    localStorage.setItem('user_data', JSON.stringify(userData));
    this.currentUserSubject.next(userData);
  }
  
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }
  
  private decodeJWTPayload(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  
  private handleError(error: HttpErrorResponse, operation: string): Observable<never> {
    console.error(`${operation} error:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error?.message || error.error?.Message) {
      errorMessage = error.error.message || error.error.Message;
    } else if (error.error?.errors) {
      const errors = Object.values(error.error.errors).flat();
      errorMessage = (errors as string[]).join(', ');
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server. Please check if the backend is running.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid credentials. Please check your email and password.';
    } else if (error.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    }
    
    return throwError(() => ({ ...error, message: errorMessage }));
  }
}