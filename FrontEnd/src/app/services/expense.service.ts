// src/app/services/expense.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Expenses, CreateExpenseRequest } from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private readonly API_URL = `${environment.apiUrl}/api/expenses`;
  
  constructor(private http: HttpClient) {}
  
  // Get all expenses
  getAllExpenses(): Observable<Expenses[]> {
    return this.http.get<Expenses[]>(this.API_URL);
  }
  
  // Get expense by ID
  getExpenseById(id: number): Observable<Expenses> {
    return this.http.get<Expenses>(`${this.API_URL}/${id}`);
  }
  
  // Create new expense
  createExpense(expense: CreateExpenseRequest): Observable<Expenses> {
    return this.http.post<Expenses>(this.API_URL, expense);
  }
  
  // Update expense
  updateExpense(id: number, expense: Expenses): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}`, expense);
  }
  
  // Delete expense
  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
  
  // Calculate total expenses
  calculateTotalExpenses(expense: Expenses): number {
    return expense.education_Expenses +
           expense.healthcare_Expenses +
           expense.interest +
           expense.zakat;
  }
}