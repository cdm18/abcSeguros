import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlanBase } from '../models/plan-base.model';

@Injectable({ providedIn: 'root' })
export class PlanBaseService {
  private api = 'http://localhost:3000/api/plan-base';
  constructor(private http: HttpClient) {}
  getBasePlans() { return this.http.get<PlanBase[]>(this.api); }
}
