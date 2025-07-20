/* ============================================================================
   PLANES COMPONENT  ·  Listado enriquecido con KPI y modal de pagos
   ============================================================================ */
import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {forkJoin, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {ApiService} from '../../services/api.service';
import {PlanBase} from '../../models/plan-base.model';
import {Payment, PaymentStatus} from '../../models/payment.model';
import {Company} from '../../models/company.model';
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-planes',
  standalone: true,
  imports    : [
    CommonModule,
    FormsModule,
    RouterModule,        // 👈 necesario para [routerLink]
  ],
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {

  /* ───────── state ───────── */
  loading = true;
  plans: (PlanBase & { company?: Company; payments?: Payment[] })[] = [];
  companies: Company[] = [];

  /* KPI */
  kpi = {total: 0, companies: 0, upcoming: 0, overdue: 0};

  /* filtros */
  filtroTexto = '';
  filtroCompany = 0;      // 0 = todas
  soloVencidos = false;

  /* modal pagos */
  showPaymentsModal = false;
  pagosModal: Payment[] = [];
  planModal?: PlanBase;

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.cargarTodo();
  }

  /* ───── Helpers para el template ───── */
  hasStatus(payments: Payment[] | undefined, s: PaymentStatus): boolean {
    return !!payments?.some(p => p.status === s);
  }

  countStatus(payments: Payment[] | undefined, s: PaymentStatus): number {
    return payments?.filter(p => p.status === s).length ?? 0;
  }

  private cargarTodo(): void {
    this.loading = true;

    forkJoin({
      planes: this.api.getPlans(),
      pagos: this.api.getPayments(),
      companies: this.api.getCompanies().pipe(catchError(() => of([] as Company[])))
    }).pipe(
      map(({planes, pagos, companies}) => {
        /* indexaciones rápidas */
        const compMap = new Map(companies.map(c => [c.id, c]));
        const pagosMap = new Map<number, Payment[]>();
        pagos.forEach(p => pagosMap.set(p.policy_id,
          [...(pagosMap.get(p.policy_id) ?? []), p]));

        /* merge */
        return planes.map(pl => ({
          ...pl,
          company : compMap.get(pl.company_id!),
          payments: pagosMap.get(pl.id) ?? []
        }));
      })
    ).subscribe({
      next: planesMerged => {
        this.plans = planesMerged;
        this.companies = [...new Set(planesMerged.map(p => p.company).filter(Boolean))] as Company[];
        this.calcularKpi();
      },
      error: err => console.error('Error cargando planes:', err),
      complete: () => this.loading = false
    });
  }

  /* KPI simples en cliente */
  private calcularKpi(): void {
    const hoy = new Date().toISOString();

    this.kpi.total = this.plans.length;
    this.kpi.companies = new Set(this.plans.map(p => p.company_id)).size;
    this.kpi.upcoming = this.plans.flatMap(p => p.payments!)
      .filter(p => p.status === 'PENDING' && p.due_date > hoy).length;
    this.kpi.overdue = this.plans.flatMap(p => p.payments!)
      .filter(p => p.status === 'LATE').length;
  }

  /* ───────── table helpers ───────── */
  get planesFiltrados() {
    return this.plans.filter(p => {
      if (this.filtroCompany && p.company_id !== this.filtroCompany) {
        return false;
      }
      if (this.soloVencidos && !p.payments!.some(pg => pg.status === 'LATE')) {
        return false;
      }
      if (this.filtroTexto) {
        const text = this.filtroTexto.toLowerCase();
        return p.name.toLowerCase().includes(text) || p.code.toLowerCase().includes(text);
      }
      return true;
    });
  }

  estadoPagoBadge(p: PaymentStatus) {
    return {
      'PENDING': 'secondary',
      'ON_TIME': 'success',
      'LATE': 'warning',
      'CANCELLED': 'danger'
    }[p];
  }

  /* ───────── modal pagos ───────── */
  abrirPagos(plan: PlanBase & { payments?: Payment[] }) {
    this.planModal = plan;
    this.pagosModal = plan.payments ?? [];
    this.showPaymentsModal = true;
  }

  cerrarPagos() {
    this.showPaymentsModal = false;
  }

  registrarPago(pago: Payment) {
    // TODO: llamada a api.updatePayment...
    alert(`Registrar pago #${pago.id} (demo)`);
  }

  /* placeholder acciones */
  eliminarPlan(p: PlanBase) {
    if (confirm(`¿Eliminar plan ${p.name}?`)) {
      // TODO: api.deletePlan…
      alert('Eliminado (demo)');
    }
  }
}
