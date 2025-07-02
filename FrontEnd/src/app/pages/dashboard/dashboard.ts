import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  totalIncome = 45000;
  totalExpenses = 28500;
  
  // Calculated properties
  get netIncome(): number {
    return this.totalIncome - this.totalExpenses;
  }
  
  get taxDue(): number {
    // Omani tax: 5% on income above OMR 42,000
    const taxableIncome = Math.max(0, this.netIncome - 42000);
    return taxableIncome * 0.05;
  }

  recentTransactions: Transaction[] = [
    {
      id: 1,
      title: 'December Salary',
      amount: 3500,
      type: 'income',
      date: '2024-12-01',
      icon: '💰'
    },
    {
      id: 2,
      title: 'Electricity Bill',
      amount: 120,
      type: 'expense',
      date: '2024-12-02',
      icon: '⚡'
    },
    {
      id: 3,
      title: 'Investment Income',
      amount: 850,
      type: 'income',
      date: '2024-12-03',
      icon: '📈'
    },
    {
      id: 4,
      title: 'Education Fees',
      amount: 1200,
      type: 'expense',
      date: '2024-12-04',
      icon: '🎓'
    },
    {
      id: 5,
      title: 'Freelance Work',
      amount: 2000,
      type: 'income',
      date: '2024-12-05',
      icon: '💻'
    }
  ];

  constructor() {}

  addIncome(): void {
    console.log('Add Income clicked');
    // TODO: Navigate to add income form or open modal
    alert('Add Income feature - Coming soon!');
  }

  addExpense(): void {
    console.log('Add Expense clicked');
    // TODO: Navigate to add expense form or open modal
    alert('Add Expense feature - Coming soon!');
  }

  calculateTax(): void {
    console.log('Calculate Tax clicked');
    const message = `
    Tax Calculation Summary:
    
    Total Income: OMR ${this.totalIncome.toLocaleString()}
    Total Expenses: OMR ${this.totalExpenses.toLocaleString()}
    Net Income: OMR ${this.netIncome.toLocaleString()}
    
    Tax Calculation:
    Taxable Income: OMR ${Math.max(0, this.netIncome - 42000).toLocaleString()}
    (Net Income - OMR 42,000 exemption)
    
    Tax Due (5%): OMR ${this.taxDue.toLocaleString()}
    `;
    alert(message);
  }

  generateReport(): void {
    console.log('Generate Report clicked');
    // TODO: Navigate to reports page or generate PDF
    alert('Generate Report feature - Coming soon!');
  }
}