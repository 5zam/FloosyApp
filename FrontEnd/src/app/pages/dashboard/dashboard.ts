import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
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
  description: string;
}

interface StepProgress {
  step: number;
  isCompleted: boolean;
  isActive: boolean;
}

interface StepNamesMap {
  [key: string]: string;
  expenses: string;
  tax: string;
  reports: string;
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
  showWelcomeGuide = false;
  currentStep = 1;
  
  // User data
  currentUser: AppUser | null = null;
  
  // Financial data
  incomes: Income[] = [];
  expenses: Expenses[] = [];
  annualCalculations: AnnualCalculation[] = [];
  
  // Form data with better initialization
  incomeForm: CreateIncomeRequest = this.getInitialIncomeForm();
  expenseForm: CreateExpenseRequest = this.getInitialExpenseForm();
  
  // Menu items with descriptions
  menuItems: MenuItem[] = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: '📊',
      description: 'View your financial summary and recent activity'
    },
    { 
      id: 'income', 
      label: 'Add Income', 
      icon: '💰',
      description: 'Record income from employment, rental, investments, etc.'
    },
    { 
      id: 'expenses', 
      label: 'Add Expenses', 
      icon: '💸',
      description: 'Track deductible expenses like education and healthcare'
    },
    { 
      id: 'tax', 
      label: 'Tax Calculator', 
      icon: '🧮',
      description: 'Calculate your annual tax liability'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: '📈',
      description: 'Generate and export financial reports'
    }
  ];
  
  // Progress tracking
  progressSteps: StepProgress[] = [
    { step: 1, isCompleted: false, isActive: true },
    { step: 2, isCompleted: false, isActive: false },
    { step: 3, isCompleted: false, isActive: false }
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

  get hasData(): boolean {
    return this.incomes.length > 0 || this.expenses.length > 0;
  }

  get progressPercentage(): number {
    const completedSteps = this.progressSteps.filter(step => step.isCompleted).length;
    return (completedSteps / this.progressSteps.length) * 100;
  }

  constructor(
    private authService: AuthService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private annualCalculationService: AnnualCalculationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeDashboard(): void {
    // Check authentication
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Set user ID for forms
    this.incomeForm.userId = this.currentUser.id;
    this.expenseForm.userId = this.currentUser.id;
    
    // Check if first visit
    const hasVisited = localStorage.getItem('dashboard_visited');
    if (!hasVisited) {
      this.showWelcomeGuide = true;
      localStorage.setItem('dashboard_visited', 'true');
    }
    
    this.loadDashboardData();
  }

  // Welcome Guide Methods
  startGuide(): void {
    this.showWelcomeGuide = false;
    this.setActiveSection('income');
  }

  skipGuide(): void {
    this.showWelcomeGuide = false;
  }

  // UI Methods
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.clearMessages();
    
    // Update step progress
    this.updateStepProgress(section);
  }

  private updateStepProgress(section: string): void {
    // Update progress based on user actions
    if (section === 'income' && this.incomes.length > 0) {
      this.progressSteps[0].isCompleted = true;
      this.progressSteps[1].isActive = true;
    }
    if (section === 'expenses' && this.expenses.length > 0) {
      this.progressSteps[1].isCompleted = true;
      this.progressSteps[2].isActive = true;
    }
    if (section === 'tax' && this.hasData) {
      this.progressSteps[2].isCompleted = true;
    }
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Data Loading with better error handling
  private loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Convert string ID to number for API calls
    const userId = parseInt(this.currentUser?.id || '1');
    
    // Load all data concurrently with proper error handling
    forkJoin({
      incomes: this.incomeService.getIncomesByUserId(userId),
      expenses: this.expenseService.getAllExpenses(),
      calculations: this.annualCalculationService.getCalculationsByUserId(userId)
    }).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.processLoadedData(data, userId);
        this.updateProgress();
      },
      error: (error) => {
        this.handleDataLoadError(error);
      }
    });
  }

  private processLoadedData(data: any, userId: number): void {
    this.incomes = Array.isArray(data.incomes) ? data.incomes : [];
    this.expenses = Array.isArray(data.expenses) 
      ? data.expenses.filter((e: Expenses) => e.userId === userId.toString()) 
      : [];
    this.annualCalculations = Array.isArray(data.calculations) ? data.calculations : [];
    
    this.calculateTotals();
    this.generateRecentTransactions();
    
    // Show success message if user has no data yet
    if (!this.hasData) {
      this.successMessage = 'Welcome! Start by adding your income and expenses to track your taxes.';
    }
  }

  private handleDataLoadError(error: any): void {
    console.error('Error loading dashboard data:', error);
    this.errorMessage = 'Unable to load your financial data. Using demo data for now.';
    this.loadMockData();
  }

  private updateProgress(): void {
    // Update progress steps based on actual data
    if (this.incomes.length > 0) {
      this.progressSteps[0].isCompleted = true;
      this.progressSteps[1].isActive = true;
    }
    if (this.expenses.length > 0) {
      this.progressSteps[1].isCompleted = true;
      this.progressSteps[2].isActive = true;
    }
    if (this.hasData) {
      this.progressSteps[2].isActive = true;
    }
  }

  // Form Actions with improved feedback
  saveIncomeData(): void {
    this.clearMessages();
    
    if (!this.validateIncomeForm()) {
      return;
    }

    this.isLoading = true;
    
    this.incomeService.createIncome(this.incomeForm).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.successMessage = 'Income data saved successfully! You can now add expenses or calculate your tax.';
        this.resetIncomeForm();
        this.loadDashboardData();
        
        // Auto-suggest next step
        setTimeout(() => {
          if (this.expenses.length === 0) {
            this.showNextStepSuggestion('expenses');
          }
        }, 2000);
      },
      error: (error) => {
        console.error('Error saving income:', error);
        this.errorMessage = 'Failed to save income data. Please check your inputs and try again.';
      }
    });
  }

  saveExpenseData(): void {
    this.clearMessages();
    
    if (!this.validateExpenseForm()) {
      return;
    }

    this.isLoading = true;
    
    this.expenseService.createExpense(this.expenseForm).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        this.successMessage = 'Expense data saved successfully! You can now calculate your tax liability.';
        this.resetExpenseForm();
        this.loadDashboardData();
        
        // Auto-suggest tax calculation
        setTimeout(() => {
          this.showNextStepSuggestion('tax');
        }, 2000);
      },
      error: (error) => {
        console.error('Error saving expense:', error);
        this.errorMessage = 'Failed to save expense data. Please check your inputs and try again.';
      }
    });
  }

  private showNextStepSuggestion(nextStep: string): void {
    const stepNames: StepNamesMap = {
      'expenses': 'add your tax-deductible expenses',
      'tax': 'calculate your annual tax liability',
      'reports': 'generate your financial reports'
    };
    
    if (stepNames[nextStep]) {
      this.successMessage += ` Ready to ${stepNames[nextStep]}?`;
    }
  }

  // Helper methods
  private getInitialIncomeForm(): CreateIncomeRequest {
    return {
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
  }

  private getInitialExpenseForm(): CreateExpenseRequest {
    return {
      userId: '',
      education_Expenses: 0,
      healthcare_Expenses: 0,
      interest: 0,
      zakat: 0,
      month_year: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
    };
  }

  // Existing methods (calculateTotals, generateRecentTransactions, etc.) remain the same
  private calculateTotals(): void {
    this.totalIncome = this.incomes.reduce((total, income) => {
      return total + this.incomeService.calculateTotalIncome(income);
    }, 0);
    
    this.totalExpenses = this.expenses.reduce((total, expense) => {
      return total + this.expenseService.calculateTotalExpenses(expense);
    }, 0);
  }

  private generateRecentTransactions(): void {
    const transactions: Transaction[] = [];
    
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
    
    this.recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  private loadMockData(): void {
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

  // Form validation methods remain the same
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

  private resetIncomeForm(): void {
    this.incomeForm = this.getInitialIncomeForm();
    this.incomeForm.userId = this.currentUser?.id || '';
  }

  private resetExpenseForm(): void {
    this.expenseForm = this.getInitialExpenseForm();
    this.expenseForm.userId = this.currentUser?.id || '';
  }

  // Quick action methods
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