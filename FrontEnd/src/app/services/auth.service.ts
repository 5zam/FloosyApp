import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
    // Load token from localStorage on service initialization
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.tokenSubject.next(token);
      // TODO: Decode JWT to get user info or call API to get current user
    }
  }
  
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
          }
        })
      );
  }
  
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData);
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  getToken(): string | null {
    return this.tokenSubject.value || localStorage.getItem('auth_token');
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // TODO: Check if token is expired
    return true;
  }
  
  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }
  
  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.tokenSubject.next(token);
    
    // TODO: Decode JWT to extract user info
    // For now, we'll set a placeholder user
    const user: AppUser = {
      id: 'temp-id',
      userName: 'temp-user',
      email: 'temp@example.com',
      fullName: 'Temp User',
      emailConfirmed: true
    };
    this.currentUserSubject.next(user);
  }
}