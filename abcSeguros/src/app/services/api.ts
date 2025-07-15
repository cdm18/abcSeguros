import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Importar modelos
import {
  User,
  LoginRequest,
  LoginResponse,
  UpdateProfileDto,
  UploadAvatarResponse
} from '../models/user';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = error.error?.error || error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Método de login con mejor tipado
  login(username: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { username, password };
    return this.http.post<LoginResponse>(`${this.base}/login`, loginData)
      .pipe(catchError(this.handleError));
  }

  // Obtener datos del usuario actual
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.base}/me`)
      .pipe(catchError(this.handleError));
  }

  // Actualizar perfil del usuario
  updateMe(dto: UpdateProfileDto): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.base}/me`, dto)
      .pipe(catchError(this.handleError));
  }

  // Subir avatar
  uploadAvatar(file: File): Observable<UploadAvatarResponse> {
    const form = new FormData();
    form.append('avatar', file);
    return this.http.post<UploadAvatarResponse>(`${this.base}/upload-avatar`, form)
      .pipe(catchError(this.handleError));
  }

  // Obtener resumen del dashboard
  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${this.base}/dashboard/summary`)
      .pipe(
        map(response => ({
          totalClients: Number(response.totalClients) || 0,
          totalPolicies: Number(response.totalPolicies) || 0,
          onTimePayments: Number(response.onTimePayments) || 0,
          pendingPayments: Number(response.pendingPayments) || 0
        })),
        catchError(this.handleError)
      );
  }

  // Obtener clientes recientes
  getRecentClients(limit = 10): Observable<Client[]> {
    const params = new HttpParams().set('limit', limit.toString());

    return this.http.get<Client[]>(`${this.base}/dashboard/clients`, { params })
      .pipe(
        map(clients => clients.map(client => ({
          ...client,
          total: client.total ? Number(client.total) : null
        }))),
        catchError(this.handleError)
      );
  }

  // Búsqueda
  search(term: string): Observable<SearchItem[]> {
    if (!term.trim()) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const params = new HttpParams().set('term', term.trim());

    return this.http.get<SearchItem[]>(`${this.base}/search`, { params })
      .pipe(catchError(this.handleError));
  }

  // Obtener planes
  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${this.base}/plans`)
      .pipe(catchError(this.handleError));
  }

  // Crear cotización
  createQuotation(quotationData: CreateQuotationRequest): Observable<QuotationResponse> {
    return this.http.post<QuotationResponse>(`${this.base}/quotations`, quotationData)
      .pipe(catchError(this.handleError));
  }

  // Obtener cotizaciones
  getQuotations(clientId?: number): Observable<Quotation[]> {
    let params = new HttpParams();
    if (clientId) {
      params = params.set('clientId', clientId.toString());
    }

    return this.http.get<Quotation[]>(`${this.base}/quotations`, { params })
      .pipe(catchError(this.handleError));
  }

  // Aceptar cotización
  acceptQuotation(quotationId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/quotations/${quotationId}/accept`, {})
      .pipe(catchError(this.handleError));
  }
}

/* ──────────── Interfaces ──────────── */
export interface Summary {
  totalClients: number;
  totalPolicies: number;
  onTimePayments: number;
  pendingPayments: number;
}

export interface Client {
  id: number;
  name: string;
  email: string;
  plan?: string | null;
  total?: number | null;
  status?: 'ACTIVE' | 'PENDING' | 'LATE' | null;
}

export interface SearchItem {
  id: number;
  label: string;
  type: 'client' | 'policy' | 'claim';
}

export interface Plan {
  id: number;
  code: string;
  name: string;
  company_id: number;
  base_premium: number;
}

export interface CreateQuotationRequest {
  client_id: number;
  plan_id: number;
  extra_coverages?: Array<{
    name: string;
    amount: number;
  }>;
}

export interface QuotationResponse {
  id: number;
  premium: number;
}

export interface Quotation {
  id: number;
  quote_amount: number;
  status: string;
  created_at: string;
  client: string;
  plan: string;
}
