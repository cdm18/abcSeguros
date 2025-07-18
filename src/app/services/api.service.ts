import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Client} from '../models/client.model';
import {Policy} from '../models/policy.model';
import {PlanBase} from '../models/plan-base.model';
import {Company} from '../models/company.model';
import {Payment} from '../models/payment.model';
import {Quotation} from '../models/quotation.model';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {
  }

  // Clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/clients`);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/clients/${id}`);
  }

  createClient(data: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}/clients`, data);
  }

  updateClient(id: number, data: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/clients/${id}`, data);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clients/${id}`);
  }

  // Planes
  getPlans(): Observable<PlanBase[]> {
    return this.http.get<PlanBase[]>(`${this.baseUrl}/plans`);
  }

  getPlan(id: number): Observable<PlanBase> {
    return this.http.get<PlanBase>(`${this.baseUrl}/plans/${id}`);
  }

  createPlan(data: Partial<PlanBase>): Observable<PlanBase> {
    return this.http.post<PlanBase>(`${this.baseUrl}/plans`, data);
  }

  updatePlan(id: number, data: Partial<PlanBase>): Observable<PlanBase> {
    return this.http.put<PlanBase>(`${this.baseUrl}/plans/${id}`, data);
  }

  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/plans/${id}`);
  }

  // Pólizas
  getPolicies(): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.baseUrl}/policies`);
  }

  getPolicy(id: number): Observable<Policy> {
    return this.http.get<Policy>(`${this.baseUrl}/policies/${id}`);
  }

  createPolicy(data: Partial<Policy>): Observable<Policy> {
    return this.http.post<Policy>(`${this.baseUrl}/policies`, data);
  }

  updatePolicy(id: number, data: Partial<Policy>): Observable<Policy> {
    return this.http.put<Policy>(`${this.baseUrl}/policies/${id}`, data);
  }

  deletePolicy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/policies/${id}`);
  }

  // Usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  createUser(data: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, data);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  // Cotizaciones
  getQuotations(): Observable<Quotation[]> {
    return this.http.get<Quotation[]>(`${this.baseUrl}/quotations`);
  }

  getQuotation(id: number): Observable<Quotation> {
    return this.http.get<Quotation>(`${this.baseUrl}/quotations/${id}`);
  }

  createQuotation(data: {
    client_id: number;
    plan_id: number;
    plan_option_id: number | null;
    quoted_by: number;
    quote_amount: number;
  }) {
    return this.http.post<any>(`${this.baseUrl}/quotations`, data);
  }

  updateQuotation(id: number, data: Partial<Quotation>): Observable<Quotation> {
    return this.http.put<Quotation>(`${this.baseUrl}/quotations/${id}`, data);
  }

  deleteQuotation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/quotations/${id}`);
  }

  // Pagos
  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/payments`);
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/payments/${id}`);
  }

  createPayment(data: Partial<Payment>): Observable<Payment> {
    return this.http.post<Payment>(`${this.baseUrl}/payments`, data);
  }

  updatePayment(id: number, data: Partial<Payment>): Observable<Payment> {
    return this.http.put<Payment>(`${this.baseUrl}/payments/${id}`, data);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/payments/${id}`);
  }

  // Compañías
  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/companies`);
  }

  getCompany(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/companies/${id}`);
  }

  createCompany(data: Partial<Company>): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/companies`, data);
  }

  updateCompany(id: number, data: Partial<Company>): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/companies/${id}`, data);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/companies/${id}`);
  }
}
