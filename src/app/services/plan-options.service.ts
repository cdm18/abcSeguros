import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlanOption} from '../models/plan-option.model';
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlanOptionsService {
  private API_URL = 'http://localhost:3000/api/plan-options';

  constructor(private http: HttpClient) {}

  getOptionsByBasePlanId(basePlanId: number): Observable<PlanOption[]> {
    return this.http.get<PlanOption[]>(`${this.API_URL}/${basePlanId}/options`);
  }
}

