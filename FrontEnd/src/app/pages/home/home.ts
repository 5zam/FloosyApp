import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
  action: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  
  services: Service[] = [
    {
      icon: '🧮',
      title: 'Tax Calculator',
      description: 'Comprehensive tax calculation system for Oman\'s Personal Income Tax Law. Calculate, plan and file your taxes with confidence.',
      features: [
        'Real-time tax calculations',
        '11 income source categories',
        'Deductions & exemptions',
        'Loss carryforward tracking',
        'Foreign tax credit management'
      ]
    },
    {
      icon: '💰',
      title: 'Income Management',
      description: 'Track all your income sources systematically according to Omani tax law classifications.',
      features: [
        'Multiple income sources',
        'Automatic categorization',
        'Recurring income setup',
        'Tax-compliant reporting',
        'Annual summaries'
      ]
    },
    {
      icon: '💸',
      title: 'Expense Management',
      description: 'Categorize and track your expenses with ability to identify tax-deductible items.',
      features: [
        'Smart categorization',
        'Receipt scanning',
        'Tax-deductible tracking',
        'Budget planning',
        'Spending analytics'
      ]
    },
    {
      icon: '📈',
      title: 'Financial Reports',
      description: 'Detailed reports and financial analysis to help you make better financial decisions.',
      features: [
        'Tax declaration generation',
        'Financial health scoring',
        'Trend analysis',
        'Compliance monitoring',
        'Export capabilities'
      ]
    }
  ];

  howItWorksSteps: Step[] = [
    {
      number: 1,
      title: 'Create Your Account',
      description: 'Sign up for free and set up your profile with tax residency information',
      icon: '👤',
      action: 'Sign Up Now'
    },
    {
      number: 2,
      title: 'Add Your Income',
      description: 'Record income from employment, rental, investments, and other sources',
      icon: '💰',
      action: 'Add Income'
    },
    {
      number: 3,
      title: 'Track Expenses',
      description: 'Log tax-deductible expenses like education, healthcare, and mortgage interest',
      icon: '💸',
      action: 'Track Expenses'
    },
    {
      number: 4,
      title: 'Calculate & File',
      description: 'Get your tax calculation and generate reports for submission',
      icon: '📊',
      action: 'Calculate Tax'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  learnMore(): void {
    this.router.navigate(['/policy']);
  }

  goToDashboard(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/dashboard' } 
      });
    }
  }

  getStarted(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  viewDemo(): void {
    // For demo, just navigate to dashboard
    this.router.navigate(['/dashboard']);
  }

  executeStepAction(step: Step): void {
    switch (step.number) {
      case 1:
        this.getStarted();
        break;
      case 2:
      case 3:
      case 4:
        this.goToDashboard();
        break;
      default:
        this.getStarted();
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}