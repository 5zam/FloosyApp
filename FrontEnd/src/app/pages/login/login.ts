import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  returnUrl = '/dashboard';

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
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  switchTab(tab: 'signin' | 'signup'): void {
    this.activeTab = tab;
    this.clearMessages();
    this.resetForms();
  }

  onSignIn(): void {
    this.clearMessages();
    
    if (!this.validateSignInForm()) {
      return;
    }

    this.isLoading = true;
    
    const loginRequest: LoginRequest = {
      email: this.signInData.email.trim(),
      password: this.signInData.password
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Check if login was successful
        if (response.success !== false && (response.token || response.Token)) {
          this.successMessage = 'Login successful! Redirecting...';
          // Delay navigation to show success message
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1000);
        } else {
          this.errorMessage = response.message || response.Message || 'Login failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Login failed. Please check your credentials and try again.';
      }
    });
  }

  onSignUp(): void {
    this.clearMessages();
    
    if (!this.validateSignUpForm()) {
      return;
    }

    this.isLoading = true;
    
    const registerRequest: RegisterRequest = {
      fullName: this.signUpData.fullName.trim(),
      email: this.signUpData.email.trim(),
      password: this.signUpData.password
    };

    this.authService.register(registerRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success !== false) {
          this.successMessage = 'Account created successfully! Please sign in to continue.';
          // Auto-switch to sign in tab and pre-fill email
          setTimeout(() => {
            this.signInData.email = this.signUpData.email;
            this.activeTab = 'signin';
            this.resetSignUpForm();
          }, 2000);
        } else {
          this.errorMessage = response.message || response.Message || 'Registration failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      }
    });
  }

  private validateSignInForm(): boolean {
    const { email, password } = this.signInData;
    
    if (!email || !password) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    return true;
  }

  private validateSignUpForm(): boolean {
    const { fullName, email, phone, password, confirmPassword, taxResidency, agreeTerms } = this.signUpData;
    
    if (!fullName || !email || !phone || !password || !confirmPassword || !taxResidency) {
      this.errorMessage = 'Please fill in all required fields';
      return false;
    }

    if (!this.isValidEmail(email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (!agreeTerms) {
      this.errorMessage = 'Please agree to the Terms of Service and Privacy Policy';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  private resetForms(): void {
    this.signInData = {
      email: '',
      password: '',
      rememberMe: false
    };
    this.resetSignUpForm();
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  signInWithGoogle(): void {
    this.errorMessage = 'Google Sign-In will be available soon! Please use email registration for now.';
  }

  signUpWithGoogle(): void {
    this.errorMessage = 'Google Sign-Up will be available soon! Please use email registration for now.';
  }
}