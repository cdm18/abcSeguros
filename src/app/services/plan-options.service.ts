import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlanOption} from '../models/plan-option.model';

@Injectable({providedIn: 'root'})
export class PlanOptionsService {
  private base = 'http://localhost:3000/api/plan-options';

  constructor(private http: HttpClient) {
  }

  getOptionsByBasePlanId(id: number) {
    return this.http.get<PlanOption[]>(`${this.base}/${id}/options`);
  }
}
