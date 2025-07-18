import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgForOf, SlicePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Client } from '../../models/client.model';
import { Quotation } from '../../models/quotation.model';
import { Payment } from '../../models/payment.model';

@Component({
  selector   : 'app-dashboard',
  standalone : true,
  imports    : [CommonModule, NgIf, NgForOf, SlicePipe],
  templateUrl: './dashboard.component.html',
  styleUrls  : ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /* colecciones traídas del backend */
  clients: Client[]     = [];
  quotations: Quotation[] = [];
  payments: Payment[]   = [];

  /* flags de UI */
  loading = true;
  errorMsg = '';

  constructor(private api: ApiService) {}

  /* ────────────── ciclo de vida ────────────── */
  ngOnInit(): void {
    this.cargarDatos();
  }

  private async cargarDatos(): Promise<void> {
    try {
      const [cli, cot, pay] = await Promise.all([
        this.api.getClients().toPromise(),
        this.api.getQuotations().toPromise(),
        this.api.getPayments().toPromise()
      ]);

      this.clients     = cli  ?? [];
      this.quotations  = cot  ?? [];
      this.payments    = pay  ?? [];

    } catch (err) {
      console.error('Error cargando dashboard', err);
      this.errorMsg = 'No se pudieron obtener los datos.';
    } finally {
      this.loading = false;
    }
  }

  /* ────────────── getters de métricas ────────────── */
  get totalClients(): number      { return this.clients.length; }
  get totalQuotations(): number   { return this.quotations.length; }
  get totalOnTime(): number       {
    return this.payments.filter(p => p.status === 'ON_TIME').length;
  }
  get totalPending(): number      {
    return this.payments.filter(p => p.status === 'PENDING').length;
  }
}
