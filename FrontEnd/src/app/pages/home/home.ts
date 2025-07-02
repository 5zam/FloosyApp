import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
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

  constructor(private router: Router) {}

  learnMore(): void {
    this.router.navigate(['/policy']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  getStarted(): void {
    this.router.navigate(['/login']);
  }

  viewDemo(): void {
    this.router.navigate(['/dashboard']);
  }
}