// src/app/services/plan-base.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanBase } from '../models/plan-base.model';

@Injectable({ providedIn: 'root' })
export class PlanBaseService {

  private readonly api = 'http://localhost:3000/api/plan-base';

  constructor(private http: HttpClient) {}

  /** Todos los planes base */
  getBasePlans(): Observable<PlanBase[]> {
    return this.http.get<PlanBase[]>(this.api);
  }

  /** Un plan base por ID */
  getBasePlanById(id: number): Observable<PlanBase> {
    return this.http.get<PlanBase>(`${this.api}/${id}`);
  }
}
