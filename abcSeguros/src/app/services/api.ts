import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:3000/api';
  constructor(private http: HttpClient) {}
  login(username:string,password:string){ return this.http.post(`${this.base}/login`,{username,password}); }
  getSummary(){ return this.http.get<Summary>(`${this.base}/dashboard/summary`); }
  getRecentClients(){ return this.http.get<Client[]>(`${this.base}/dashboard/clients`); }
}

export interface Summary{
  totalClients:number; totalPolicies:number;
  onTimePayments:number; pendingPayments:number;
}
export interface Client {
  id:number;
  name:string;
  email:string;
  plan?:string|null;
  total?:number|null;
  status?:'ACTIVE'|'PENDING'|'LATE'|null;
}


