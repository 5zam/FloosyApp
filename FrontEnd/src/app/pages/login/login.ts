import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, RegisterRequest } from '../../models/api.models';

interface SignInData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface SignUpData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  taxResidency: string;
  agreeTerms: boolean;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  activeTab: 'signin' | 'signup' = 'signin';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  signInData: SignInData = {
    email: '',
    password: '',
    rememberMe: false
  };

  signUpData: SignUpData = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    taxResidency: '',
    agreeTerms: false
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  switchTab(tab: 'signin' | 'signup'): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  onSignIn(): void {
    this.clearMessages();
    
    if (!this.signInData.email || !this.signInData.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    
    const loginRequest: LoginRequest = {
      email: this.signInData.email,
      password: this.signInData.password
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.token) {
          this.successMessage = 'Login successful! Redirecting to dashboard...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }

  onSignUp(): void {
    this.clearMessages();
    
    // Validation
    if (!this.validateSignUpForm()) {
      return;
    }

    this.isLoading = true;
    
    const registerRequest: RegisterRequest = {
      fullName: this.signUpData.fullName,
      email: this.signUpData.email,
      password: this.signUpData.password
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Please sign in.';
        setTimeout(() => {
          this.activeTab = 'signin';
          this.resetSignUpForm();
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }

  private validateSignUpForm(): boolean {
    if (!this.signUpData.fullName || 
        !this.signUpData.email || 
        !this.signUpData.phone || 
        !this.signUpData.password || 
        !this.signUpData.confirmPassword ||
        !this.signUpData.taxResidency) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    if (this.signUpData.password !== this.signUpData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (this.signUpData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    if (!this.signUpData.agreeTerms) {
      this.errorMessage = 'Please agree to the Terms of Service and Privacy Policy';
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.signUpData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    return true;
  }

  private resetSignUpForm(): void {
    this.signUpData = {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      taxResidency: '',
      agreeTerms: false
    };
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  signInWithGoogle(): void {
    this.errorMessage = 'Google Sign-In integration - Coming soon!';
  }

  signUpWithGoogle(): void {
    this.errorMessage = 'Google Sign-Up integration - Coming soon!';
  }
}