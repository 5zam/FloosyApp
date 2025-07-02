export interface AppUser {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
}

export interface Income {
  incomeId: number;
  userId: string;
  employmentIncome: number;
  selfEmploymentIncome: number;
  rentalIncome: number;
  royaltyIncome: number;
  interestIncome: number;
  dividendSukukIncome: number;
  realEstateDisposalGains: number;
  retirementEosbIncome: number;
  prizeIncome: number;
  grants: number;
  boardMemberCompensation: number;
  month_year: string;
  createAt: Date;
  user?: AppUser;
}

export interface Expenses {
  expensesId: number;
  userId: string;
  education_Expenses: number;
  healthcare_Expenses: number;
  interest: number;
  zakat: number;
  month_year: string;
  createAt: Date;
  user?: AppUser;
}

export interface AnnualCalculation {
  annualCalculationId: number;
  userId: string;
  year: string;
  totalIncome: number;
  totalExpenses: number;
  tax: number;
  month_year: string;
  createAt: Date;
  user?: AppUser;
}

// Auth DTOs
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  message?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

// Create/Update DTOs
export interface CreateIncomeRequest {
  userId: string;
  employmentIncome: number;
  selfEmploymentIncome: number;
  rentalIncome: number;
  royaltyIncome: number;
  interestIncome: number;
  dividendSukukIncome: number;
  realEstateDisposalGains: number;
  retirementEosbIncome: number;
  prizeIncome: number;
  grants: number;
  boardMemberCompensation: number;
  month_year: string;
}

export interface CreateExpenseRequest {
  userId: string;
  education_Expenses: number;
  healthcare_Expenses: number;
  interest: number;
  zakat: number;
  month_year: string;
}

export interface CreateAnnualCalculationRequest {
  userId: string;
  year: string;
  totalIncome: number;
  totalExpenses: number;
  tax: number;
  month_year: string;
}