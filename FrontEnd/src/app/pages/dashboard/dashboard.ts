import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { IncomeService } from '../../services/income.service';
import { ExpenseService } from '../../services/expense.service';
import { AnnualCalculationService } from '../../services/annual-calculation.service';
import { Income, Expenses, AnnualCalculation, AppUser, CreateIncomeRequest, CreateExpenseRequest } from '../../models/api.models';

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  icon: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // UI State
  sidebarOpen = true;
  activeSection = 'overview';
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  
  // User data
  currentUser: AppUser | null = null;
  
  // Financial data
  incomes: Income[] = [];
  expenses: Expenses[] = [];
  annualCalculations: AnnualCalculation[] = [];
  
  // Form data
  incomeForm: CreateIncomeRequest = {
    userId: '',
    employmentIncome: 0,
    selfEmploymentIncome: 0,
    rentalIncome: 0,
    royaltyIncome: 0,
    interestIncome: 0,
    dividendSukukIncome: 0,
    realEstateDisposalGains: 0,
    retirementEosbIncome: 0,
    prizeIncome: 0,
    grants: 0,
    boardMemberCompensation: 0,
    month_year: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  };
  
  expenseForm: CreateExpenseRequest = {
    userId: '',
    education_Expenses: 0,
    healthcare_Expenses: 0,
    interest: 0,
    zakat: 0,
    month_year: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  };
  
  // Menu items for sidebar
  menuItems: MenuItem[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'income', label: 'Income', icon: '💰' },
    { id: 'expenses', label: 'Expenses', icon: '💸' },
    { id: 'tax', label: 'Tax Calculator', icon: '🧮' },
    { id: 'reports', label: 'Reports', icon: '📈' }
  ];
  
  // Calculated totals
  totalIncome = 0;
  totalExpenses = 0;
  recentTransactions: Transaction[] = [];
  
  // Computed properties
  get netIncome(): number {
    return this.totalIncome - this.totalExpenses;
  }
  
  get taxDue(): number {
    return this.annualCalculationService.calculateTax(this.totalIncome, this.totalExpenses);
  }

  constructor(
    private authService: AuthService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private annualCalculationService: AnnualCalculationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Set user ID for forms
    this.incomeForm.userId = this.currentUser.id;
    this.expenseForm.userId = this.currentUser.id;
    
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // UI Methods
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.clearMessages();
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Data Loading
  private loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // For now, we'll use mock user ID. In real implementation, get from JWT token
    const userId = 1; // This should come from authenticated user
    
    // Load all data concurrently
    forkJoin({
      incomes: this.incomeService.getIncomesByUserId(userId),
      expenses: this.expenseService.getAllExpenses(), // Note: Backend doesn't have getByUserId for expenses
      calculations: this.annualCalculationService.getCalculationsByUserId(userId)
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.incomes = data.incomes;
        this.expenses = data.expenses.filter(e => e.userId === userId.toString()); // Client-side filter
        this.annualCalculations = data.calculations;
        
        this.calculateTotals();
        this.generateRecentTransactions();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.errorMessage = 'Failed to load dashboard data. Please try refreshing the page.';
        this.isLoading = false;
        
        // Use mock data as fallback
        this.loadMockData();
      }
    });
  }

  private calculateTotals(): void {
    // Calculate total income
    this.totalIncome = this.incomes.reduce((total, income) => {
      return total + this.incomeService.calculateTotalIncome(income);
    }, 0);
    
    // Calculate total expenses
    this.totalExpenses = this.expenses.reduce((total, expense) => {
      return total + this.expenseService.calculateTotalExpenses(expense);
    }, 0);
  }

  private generateRecentTransactions(): void {
    const transactions: Transaction[] = [];
    
    // Add income transactions
    this.incomes.slice(0, 3).forEach(income => {
      const totalAmount = this.incomeService.calculateTotalIncome(income);
      if (totalAmount > 0) {
        transactions.push({
          id: income.incomeId,
          title: `Income - ${income.month_year}`,
          amount: totalAmount,
          type: 'income',
          date: new Date(income.createAt).toLocaleDateString(),
          icon: '💰'
        });
      }
    });
    
    // Add expense transactions
    this.expenses.slice(0, 3).forEach(expense => {
      const totalAmount = this.expenseService.calculateTotalExpenses(expense);
      if (totalAmount > 0) {
        transactions.push({
          id: expense.expensesId,
          title: `Expenses - ${expense.month_year}`,
          amount: totalAmount,
          type: 'expense',
          date: new Date(expense.createAt).toLocaleDateString(),
          icon: '💸'
        });
      }
    });
    
    // Sort by date (most recent first)
    this.recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  private loadMockData(): void {
    // Fallback mock data when API fails
    this.totalIncome = 45000;
    this.totalExpenses = 28500;
    
    this.recentTransactions = [
      {
        id: 1,
        title: 'December Salary',
        amount: 3500,
        type: 'income',
        date: new Date().toLocaleDateString(),
        icon: '💰'
      },
      {
        id: 2,
        title: 'Education Expenses',
        amount: 1200,
        type: 'expense',
        date: new Date().toLocaleDateString(),
        icon: '🎓'
      }
    ];
  }

  // Form Actions
  saveIncomeData(): void {
    this.clearMessages();
    
    if (!this.validateIncomeForm()) {
      return;
    }

    this.isLoading = true;
    
    this.incomeService.createIncome(this.incomeForm).subscribe({
      next: (response) => {
        this.successMessage = 'Income data saved successfully!';
        this.resetIncomeForm();
        this.loadDashboardData(); // Reload data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving income:', error);
        this.errorMessage = 'Failed to save income data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  saveExpenseData(): void {
    this.clearMessages();
    
    if (!this.validateExpenseForm()) {
      return;
    }

    this.isLoading = true;
    
    this.expenseService.createExpense(this.expenseForm).subscribe({
      next: (response) => {
        this.successMessage = 'Expense data saved successfully!';
        this.resetExpenseForm();
        this.loadDashboardData(); // Reload data
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving expense:', error);
        this.errorMessage = 'Failed to save expense data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Form Validation
  private validateIncomeForm(): boolean {
    if (!this.incomeForm.month_year) {
      this.errorMessage = 'Please select a month/year';
      return false;
    }
    
    const totalIncome = Object.values(this.incomeForm)
      .filter(value => typeof value === 'number')
      .reduce((sum, value) => sum + value, 0);
    
    if (totalIncome <= 0) {
      this.errorMessage = 'Please enter at least one income amount';
      return false;
    }
    
    return true;
  }

  private validateExpenseForm(): boolean {
    if (!this.expenseForm.month_year) {
      this.errorMessage = 'Please select a month/year';
      return false;
    }
    
    const totalExpenses = this.expenseForm.education_Expenses +
                         this.expenseForm.healthcare_Expenses +
                         this.expenseForm.interest +
                         this.expenseForm.zakat;
    
    if (totalExpenses <= 0) {
      this.errorMessage = 'Please enter at least one expense amount';
      return false;
    }
    
    return true;
  }

  // Form Reset
  private resetIncomeForm(): void {
    this.incomeForm = {
      userId: this.currentUser?.id || '',
      employmentIncome: 0,
      selfEmploymentIncome: 0,
      rentalIncome: 0,
      royaltyIncome: 0,
      interestIncome: 0,
      dividendSukukIncome: 0,
      realEstateDisposalGains: 0,
      retirementEosbIncome: 0,
      prizeIncome: 0,
      grants: 0,
      boardMemberCompensation: 0,
      month_year: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    };
  }

  private resetExpenseForm(): void {
    this.expenseForm = {
      userId: this.currentUser?.id || '',
      education_Expenses: 0,
      healthcare_Expenses: 0,
      interest: 0,
      zakat: 0,
      month_year: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    };
  }

  // Legacy Action Methods (for backward compatibility)
  addIncome(): void {
    this.setActiveSection('income');
  }

  addExpense(): void {
    this.setActiveSection('expenses');
  }

  calculateTax(): void {
    this.setActiveSection('tax');
  }

  generateReport(): void {
    this.setActiveSection('reports');
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  logout(): void {
    this.authService.logout();
  }
}