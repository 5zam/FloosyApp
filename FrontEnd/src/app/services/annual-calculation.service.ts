import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnnualCalculation, CreateAnnualCalculationRequest } from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnualCalculationService {
  private readonly API_URL = `${environment.apiUrl}/api/annualcalculations`;
  
  constructor(private http: HttpClient) {}
  
  // Get all annual calculations
  getAllCalculations(): Observable<AnnualCalculation[]> {
    return this.http.get<AnnualCalculation[]>(this.API_URL);
  }
  
  // Get calculations by user ID
  getCalculationsByUserId(userId: number): Observable<AnnualCalculation[]> {
    return this.http.get<AnnualCalculation[]>(`${this.API_URL}/${userId}`);
  }
  
  // Create new calculation
  createCalculation(calculation: CreateAnnualCalculationRequest): Observable<AnnualCalculation> {
    return this.http.post<AnnualCalculation>(this.API_URL, calculation);
  }
  
  // Update calculation
  updateCalculation(id: number, calculation: AnnualCalculation): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}`, calculation);
  }
  
  // Delete calculation
  deleteCalculation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
  
  // Calculate tax based on Omani tax law
  calculateTax(totalIncome: number, totalExpenses: number): number {
    const netIncome = totalIncome - totalExpenses;
    const taxableIncome = Math.max(0, netIncome - 42000); // OMR 42,000 exemption
    return taxableIncome * 0.05; // 5% tax rate
  }
  
  // Create automatic annual calculation
  createAnnualCalculation(
    userId: string,
    year: string,
    totalIncome: number,
    totalExpenses: number
  ): CreateAnnualCalculationRequest {
    const tax = this.calculateTax(totalIncome, totalExpenses);
    
    return {
      userId,
      year,
      totalIncome,
      totalExpenses,
      tax,
      month_year: `December ${year}`
    };
  }
}