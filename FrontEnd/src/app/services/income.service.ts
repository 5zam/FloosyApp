import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Income, CreateIncomeRequest } from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private readonly API_URL = `${environment.apiUrl}/api/incomes`;
  
  constructor(private http: HttpClient) {}
  
  // Get all incomes
  getAllIncomes(): Observable<Income[]> {
    return this.http.get<Income[]>(this.API_URL);
  }
  
  // Get incomes by user ID
  getIncomesByUserId(userId: number): Observable<Income[]> {
    return this.http.get<Income[]>(`${this.API_URL}/${userId}`);
  }
  
  // Create new income
  createIncome(income: CreateIncomeRequest): Observable<Income> {
    return this.http.post<Income>(this.API_URL, income);
  }
  
  // Update income
  updateIncome(id: number, income: Income): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}`, income);
  }
  
  // Delete income
  deleteIncome(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
  
  // Calculate total income for a specific month/year
  calculateTotalIncome(income: Income): number {
    return income.employmentIncome +
           income.selfEmploymentIncome +
           income.rentalIncome +
           income.royaltyIncome +
           income.interestIncome +
           income.dividendSukukIncome +
           income.realEstateDisposalGains +
           income.retirementEosbIncome +
           income.prizeIncome +
           income.grants +
           income.boardMemberCompensation;
  }
}