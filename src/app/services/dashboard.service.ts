// src/app/services/dashboard.service.ts
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { ApiService } from './api.service';

import { Client }     from '../models/client.model';
import { Quotation }  from '../models/quotation.model';
import { Payment }    from '../models/payment.model';

export interface DashboardStats {
  totalClients:      number;
  totalQuotations:   number;
  onTimePayments:    number;
  pendingPayments:   number;
  lastClients:       Client[];
  lastQuotations:    Quotation[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly api = inject(ApiService);

  /* ---- único método público ---- */
  getStats(): Observable<DashboardStats> {

    return forkJoin({
      clients    : this.api.getClients(),
      quotations : this.api.getQuotations(),
      payments   : this.api.getPayments()
    }).pipe(
      map(({ clients, quotations, payments }) => {

        const totalClients    = clients.length;
        const totalQuotations = quotations.length;
        const onTimePayments  = payments.filter(p => p.status === 'ON_TIME').length;
        const pendingPayments = payments.filter(p => p.status === 'PENDING').length;

        /* 5 más recientes por fecha (ignora undefined) */
        const sortByDate = <T extends { created_at?: string }>(a:T,b:T)=>
          new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();

        const lastClients    = [...clients].sort(sortByDate).slice(0,6);
        const lastQuotations = [...quotations].sort(sortByDate).slice(0,5);

        return {
          totalClients,
          totalQuotations,
          onTimePayments,
          pendingPayments,
          lastClients,
          lastQuotations
        };
      })
    );
  }
}
