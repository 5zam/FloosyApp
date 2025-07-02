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
        
        // Handle both uppercase and lowercase response properties
        const token = response.token || response.Token;
        const message = response.message || response.Message;
        
        if (token) {
          this.successMessage = 'Login successful! Redirecting...';
          // Delay navigation to show success message
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1000);
        } else {
          this.errorMessage = message || 'Login failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error, 'Login failed. Please check your credentials and try again.');
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
        this.successMessage = 'Account created successfully! Please sign in to continue.';
        // Auto-switch to sign in tab and pre-fill email
        setTimeout(() => {
          this.signInData.email = this.signUpData.email;
          this.activeTab = 'signin';
          this.resetSignUpForm();
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError(error, 'Registration failed. Please try again.');
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

  private handleError(error: any, defaultMessage: string): void {
    console.error('Auth error:', error);
    
    if (error.error?.message || error.error?.Message) {
      this.errorMessage = error.error.message || error.error.Message;
    } else if (error.error?.errors) {
      // Handle validation errors from backend
      const errors = Object.values(error.error.errors).flat();
      this.errorMessage = (errors as string[]).join(', ');
    } else if (error.message) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = defaultMessage;
    }
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