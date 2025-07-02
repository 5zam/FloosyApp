import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

  switchTab(tab: 'signin' | 'signup'): void {
    this.activeTab = tab;
  }

  onSignIn(): void {
    if (!this.signInData.email || !this.signInData.password) {
      alert('Please fill in all required fields');
      return;
    }

    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('Login successful! Redirecting to dashboard...');
      this.router.navigate(['/dashboard']);
    }, 2000);
  }

  onSignUp(): void {
    // Basic validation
    if (!this.signUpData.fullName || 
        !this.signUpData.email || 
        !this.signUpData.phone || 
        !this.signUpData.password || 
        !this.signUpData.confirmPassword ||
        !this.signUpData.taxResidency) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.signUpData.password !== this.signUpData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (this.signUpData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    if (!this.signUpData.agreeTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('Account created successfully! Please check your email for verification.');
      this.activeTab = 'signin';
      // Reset form
      this.signUpData = {
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        taxResidency: '',
        agreeTerms: false
      };
    }, 2000);
  }

  signInWithGoogle(): void {
    alert('Google Sign-In integration - Coming soon!');
  }

  signUpWithGoogle(): void {
    alert('Google Sign-Up integration - Coming soon!');
  }
}