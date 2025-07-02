import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // Add auth token to requests if available
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  // Add Content-Type header for all requests
  if (!req.headers.has('Content-Type')) {
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  return next(req);
};