import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Client } from '../models/client.model';
import { Policy } from '../models/policy.model';
import { PlanBase } from '../models/plan-base.model';
import { Company } from '../models/company.model';
import { Payment } from '../models/payment.model';
import { Quotation } from '../models/quotation.model';
import { User } from '../models/user.model';
import {PlanOption} from "../models/plan-option.model";

export interface CreateQuotationRequest {
  client_id: number;
  plan_id: number;
  plan_option_id: number | null;
  quoted_by: number;
  quote_amount: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  /* -------------- Error Handling -------------- */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    console.error('ApiService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /* -------------- Generic CRUD Operations -------------- */
  private get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  private post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /* -------------- Clients -------------- */
  getClients(): Observable<Client[]> {
    return this.get<Client[]>('/clients');
  }

  getClient(id: number): Observable<Client> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de cliente inválido'));
    }
    return this.get<Client>(`/clients/${id}`);
  }

  /* ⬇️ alta rápida para el wizard
     Acepta solo nombre, apellido, email y teléfono.
     Ajusta los nombres de acuerdo con tu API si usa snake_case. */
  createClientSimplified(data: {
    first_name: string;
    last_name : string;
    email     : string;
    phone     : string;
  }): Observable<Client> {
    return this.post<Client>('/clients', data);
  }

  /* …si ya tenías un createClient “completo”, déjalo también: */
  createClient(data: Partial<Client>): Observable<Client> {
    if (!data) {
      return throwError(() => new Error('Datos del cliente requeridos'));
    }
    return this.post<Client>('/clients', data);
  }

  updateClient(id: number, data: Partial<Client>): Observable<Client> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de cliente inválido'));
    }
    if (!data) {
      return throwError(() => new Error('Datos del cliente requeridos'));
    }
    return this.put<Client>(`/clients/${id}`, data);
  }

  deleteClient(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de cliente inválido'));
    }
    return this.delete<void>(`/clients/${id}`);
  }




  /* -------------- Plans Base (PlanBase) -------------- */
  getPlans(): Observable<PlanBase[]> {
    return this.get<PlanBase[]>('/plan-base');
  }

  getPlan(id: number): Observable<PlanBase> {
    return this.get<PlanBase>(`/plan-base/${id}`);
  }


  getPlanOptionsByBase(baseId:number){
    return this.get<PlanOption[]>(`/plan-options/${baseId}/options`);
  }

  createPlan(data: Partial<PlanBase>): Observable<PlanBase> {
    if (!data) {
      return throwError(() => new Error('Datos del plan requeridos'));
    }
    return this.post<PlanBase>('/plans', data);
  }

  updatePlan(id: number, data: Partial<PlanBase>): Observable<PlanBase> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de plan inválido'));
    }
    if (!data) {
      return throwError(() => new Error('Datos del plan requeridos'));
    }
    return this.put<PlanBase>(`/plans/${id}`, data);
  }

  deletePlan(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de plan inválido'));
    }
    return this.delete<void>(`/plans/${id}`);
  }

  /* -------------- Policies -------------- */
  getPolicies(): Observable<Policy[]> {
    return this.get<Policy[]>('/policies');
  }

  getPolicy(id: number): Observable<Policy> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de póliza inválido'));
    }
    return this.get<Policy>(`/policies/${id}`);
  }

  createPolicy(data: Partial<Policy>): Observable<Policy> {
    if (!data) {
      return throwError(() => new Error('Datos de la póliza requeridos'));
    }
    return this.post<Policy>('/policies', data);
  }

  updatePolicy(id: number, data: Partial<Policy>): Observable<Policy> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de póliza inválido'));
    }
    if (!data) {
      return throwError(() => new Error('Datos de la póliza requeridos'));
    }
    return this.put<Policy>(`/policies/${id}`, data);
  }

  deletePolicy(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de póliza inválido'));
    }
    return this.delete<void>(`/policies/${id}`);
  }

  /* -------------- Users (Brokers) -------------- */
  getUsers(): Observable<User[]> {
    return this.get<User[]>('/users');
  }

  getUser(id: number): Observable<User> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de usuario inválido'));
    }
    return this.get<User>(`/users/${id}`);
  }

  createUser(data: Partial<User>): Observable<User> {
    if (!data) {
      return throwError(() => new Error('Datos del usuario requeridos'));
    }
    return this.post<User>('/users', data);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de usuario inválido'));
    }
    if (!data) {
      return throwError(() => new Error('Datos del usuario requeridos'));
    }
    return this.put<User>(`/users/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de usuario inválido'));
    }
    return this.delete<void>(`/users/${id}`);
  }

  /* -------------- Quotations -------------- */
  getQuotations(): Observable<Quotation[]> {
    return this.get<Quotation[]>('/quotations');
  }

  getQuotation(id: number): Observable<Quotation> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de cotización inválido'));
    }
    return this.get<Quotation>(`/quotations/${id}`);
  }

  createQuotation(data: CreateQuotationRequest): Observable<Quotation> {
    if (!data) {
      return throwError(() => new Error('Datos de la cotización requeridos'));
    }

    // Validaciones específicas para cotizaciones
    if (!data.client_id || data.client_id <= 0) {
      return throwError(() => new Error('ID de cliente inválido'));
    }
    if (!data.plan_id || data.plan_id <= 0) {
      return throwError(() => new Error('ID de plan inválido'));
    }
    if (!data.quoted_by || data.quoted_by <= 0) {
      return throwError(() => new Error('ID del broker inválido'));
    }
    if (!data.quote_amount || data.quote_amount <= 0) {
      return throwError(() => new Error('Monto de cotización inválido'));
    }

    return this.post<Quotation>('/quotations', data);
  }

  updateQuotation(id: number, data: Partial<Quotation>): Observable<Quotation> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de cotización inválido'));
    }
    if (!data) {
      return throwError(() => new Error('Datos de la cotización requeridos'));
    }
    return this.put<Quotation>(`/quotations/${id}`, data);
  }

  deleteQuotation(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de cotización inválido'));
    }
    return this.delete<void>(`/quotations/${id}`);
  }

  /* -------------- Payments -------------- */
  getPayments(): Observable<Payment[]> {
    return this.get<Payment[]>('/payments');
  }

  getPayment(id: number): Observable<Payment> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de pago inválido'));
    }
    return this.get<Payment>(`/payments/${id}`);
  }

  createPayment(data: Partial<Payment>): Observable<Payment> {
    if (!data) {
      return throwError(() => new Error('Datos del pago requeridos'));
    }
    return this.post<Payment>('/payments', data);
  }

  updatePayment(id: number, data: Partial<Payment>): Observable<Payment> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de pago inválido'));
    }
    if (!data) {
      return throwError(() => new Error('Datos del pago requeridos'));
    }
    return this.put<Payment>(`/payments/${id}`, data);
  }

  deletePayment(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de pago inválido'));
    }
    return this.delete<void>(`/payments/${id}`);
  }

  /* -------------- Companies -------------- */
  getCompanies(): Observable<Company[]> {
    return this.get<Company[]>('/companies');
  }

  getCompany(id: number): Observable<Company> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de compañía inválido'));
    }
    return this.get<Company>(`/companies/${id}`);
  }

  createCompany(data: Partial<Company>): Observable<Company> {
    if (!data) {
      return throwError(() => new Error('Datos de la compañía requeridos'));
    }
    return this.post<Company>('/companies', data);
  }

  updateCompany(id: number, data: Partial<Company>): Observable<Company> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de compañía inválido'));
    }
    if (!data) {
      return throwError(() => new Error('Datos de la compañía requeridos'));
    }
    return this.put<Company>(`/companies/${id}`, data);
  }

  deleteCompany(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('ID de compañía inválido'));
    }
    return this.delete<void>(`/companies/${id}`);
  }

  /* -------------- Utility Methods -------------- */

  /**
   * Verifica si el servicio está disponible
   */
  healthCheck(): Observable<any> {
    return this.get('/health');
  }

  /**
   * Obtiene estadísticas generales del dashboard
   */
  getDashboardStats(): Observable<any> {
    return this.get('/dashboard/stats');
  }

  getPaymentsByPlan(planId: number) {
    return this.get<Payment[]>(`/payments?planId=${planId}`);
  }

  // src/app/services/api.service.ts
  getPolicyMetadata(id: number): Observable<any> {
    return this.http.get<any>(`{/policies/${id}/metadata`);
  }

  updatePolicyMetadata(id: number, metadata: any): Observable<any> {
    return this.http.put(`/policies/${id}/metadata`, metadata);
  }




}
