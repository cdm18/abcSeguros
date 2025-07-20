/* ============================================================================
   POLIZAS COMPONENT
   Listado + KPI + Pagos + Crear/Editar con metadatos flexibles
   ============================================================================ */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subscription } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { Policy, PolicyStatus } from '../../models/policy.model';
import { Client } from '../../models/client.model';
import { PlanBase } from '../../models/plan-base.model';
import { Company } from '../../models/company.model';
import { Payment, PaymentStatus } from '../../models/payment.model';

/* ——— Relaciones enriquecidas ——— */
interface PolicyWithRels extends Policy {
  client?: Client;
  plan?: PlanBase;
  company?: Company;
  payments?: Payment[];
}

/* ——— KPI ——— */
interface Kpi {
  total: number;
  active: number;
  pending: number;
  late: number;
  cancelled: number;
  upcoming: number;
  overdue: number;
}

@Component({
  selector: 'app-polizas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './polizas.component.html',
  styleUrls: ['./polizas.component.scss']
})
export class PolizasComponent implements OnInit, OnDestroy {

  /* ---------- Estado general ---------- */
  loading = true;
  policies: PolicyWithRels[] = [];

  /* ---------- KPI ---------- */
  kpi: Kpi = { total: 0, active: 0, pending: 0, late: 0, cancelled: 0, upcoming: 0, overdue: 0 };

  /* ---------- Filtros ---------- */
  filtroTexto = '';
  filtroCompany = 0;
  filtroStatus = '';
  soloVencidos = false;

  /* ---------- Modal Pagos ---------- */
  showPaymentsModal = false;
  policyModal?: PolicyWithRels;
  pagosModal: Payment[] = [];

  /* ---------- Modal Crear/Editar ---------- */
  showFormModal = false;
  formMode: 'crear' | 'editar' = 'crear';

  // Formulario combinado (póliza + metadatos)
  formData: Partial<Policy> & {
    extra_auto_placa?: string;
    extra_vida_beneficiarios?: number;
    extra_hogar_valor_vivienda?: number;
    extra_viaje_pais_origen?: string;
    extra_viaje_pais_destino?: string;
  } = {};

  clientes: Client[] = [];
  planes: PlanBase[] = [];

  /* ---------- Utilidades ---------- */
  private subs = new Subscription();

  // Para mostrar campos condicionales
  tipoPlanActual = '';

  // Simulación rápida de toast
  private toast = { success: (msg: string) => alert(msg) };

  /* ---------- Labels KPI ---------- */
  readonly kpiLabels = [
    { key: 'total',      label: 'Total' },
    { key: 'active',     label: 'Activas' },
    { key: 'pending',    label: 'Pendientes' },
    { key: 'late',       label: 'Vencidas' },
    { key: 'cancelled',  label: 'Canceladas' },
    { key: 'upcoming',   label: 'Próximos Pagos' },
    { key: 'overdue',    label: 'Pagos Atrasados' }
  ] as const;

  /* =====================================================
     CONSTRUCTOR
     ===================================================== */
  constructor(private api: ApiService) {}

  /* =====================================================
     CICLO DE VIDA
     ===================================================== */
  ngOnInit(): void { this.cargarDatos(); }
  ngOnDestroy(): void { this.subs.unsubscribe(); }

  /* =====================================================
     CARGA INICIAL (policies + rels + pagos)
     ===================================================== */
  private cargarDatos(): void {
    this.loading = true;

    this.subs.add(
      forkJoin({
        policies:  this.api.getPolicies(),
        clients:   this.api.getClients(),
        plans:     this.api.getPlans(),
        companies: this.api.getCompanies(),
        payments:  this.api.getPayments()
      })
        .subscribe({
          next: ({ policies, clients, plans, companies, payments }) => {
            /* Mapas para joinear en memoria */
            const cMap  = new Map(clients.map(c => [c.id,  c]));
            const plMap = new Map(plans  .map(pl => [pl.id, pl]));
            const coMap = new Map(companies.map(co => [co.id, co]));

            const payByPolicy = new Map<number, Payment[]>();
            payments.forEach(p => {
              const arr = payByPolicy.get(p.policy_id) ?? [];
              arr.push(p);
              payByPolicy.set(p.policy_id, arr);
            });

            /* Construir array enriquecido */
            this.policies = policies.map(pol => {
              const plan = plMap.get(pol.plan_id);
              return {
                ...pol,
                client:  cMap.get(pol.client_id),
                plan,
                company: plan?.company_id ? coMap.get(plan.company_id) : undefined,
                payments: payByPolicy.get(pol.id) ?? []
              };
            });

            this.clientes = clients;
            this.planes   = plans;

            this.calcularKpi();
            this.loading = false;
          },
          error: err => {
            console.error('Error cargando pólizas:', err);
            this.loading = false;
          }
        })
    );
  }

  /* =====================================================
     KPI
     ===================================================== */
  private calcularKpi(): void {
    const all = this.policies;
    this.kpi.total      = all.length;
    this.kpi.active     = this.countStatus(all, 'ACTIVE');
    this.kpi.pending    = this.countStatus(all, 'PENDING');
    this.kpi.late       = this.countStatus(all, 'LATE');
    this.kpi.cancelled  = this.countStatus(all, 'CANCELLED');
    this.kpi.upcoming   = all.filter(p => this.hasPendingPayments(p)).length;
    this.kpi.overdue    = all.filter(p => this.hasLatePayments(p)).length;
  }
  private countStatus(arr: PolicyWithRels[], s: PolicyStatus) {
    return arr.filter(p => p.status === s).length;
  }

  /* =====================================================
     HELPERS para plantilla
     ===================================================== */
  hasLatePayments    = (p: PolicyWithRels) => p.payments?.some(pg => pg.status === 'LATE');
  hasPendingPayments = (p: PolicyWithRels) => p.payments?.some(pg => pg.status === 'PENDING');

  countLate      = (p: PolicyWithRels) => p.payments?.filter(pg => pg.status === 'LATE').length ?? 0;
  countUpcoming  = (p: PolicyWithRels) => p.payments?.filter(pg => pg.status === 'PENDING').length ?? 0;

  estadoPolizaBadge(st: PolicyStatus | undefined): string {
    if (!st) return 'secondary';                // fallback
    return ({
      ACTIVE: 'success',
      PENDING: 'warning text-dark',
      LATE: 'danger',
      CANCELLED: 'secondary'
    } as Record<PolicyStatus, string>)[st];
  }


  estadoPagoBadge(st: PaymentStatus | undefined): string {
    if (!st) return 'secondary';
    return ({
      PENDING  : 'warning text-dark',
      LATE     : 'danger',
      ON_TIME  : 'danger',
      PAID     : 'success',
      CANCELLED: 'success'
    } as Record<PaymentStatus, string>)[st];
  }

  /* =====================================================
     LISTA FILTRADA (GETTER)
     ===================================================== */
  get polizasFiltradas(): PolicyWithRels[] {
    return this.policies
      .filter(p => {
        const t = this.filtroTexto.trim().toLowerCase();
        if (!t) return true;
        return p.policy_number.toLowerCase().includes(t) ||
          p.plan?.name?.toLowerCase().includes(t);
      })
      .filter(p => this.filtroCompany === 0 || p.plan?.company_id === this.filtroCompany)
      .filter(p => !this.filtroStatus || p.status === this.filtroStatus)
      .filter(p => !this.soloVencidos || p.status === 'LATE');
  }

  /* =====================================================
     PAGOS
     ===================================================== */
  abrirPagos(p: PolicyWithRels): void {
    this.policyModal = p;
    this.pagosModal  = p.payments ?? [];
    this.showPaymentsModal = true;
  }
  cerrarPagos(): void { this.showPaymentsModal = false; }

  registrarPago(pg: Payment): void {
    const payload: Partial<Payment> = { paid_date: new Date().toISOString(), status: 'ON_TIME' };
    this.api.updatePayment(pg.id!, payload).subscribe({
      next: upd => {
        pg.status    = upd.status!;
        pg.paid_date = upd.paid_date;
        this.calcularKpi();
      },
      error: err => alert('Error registrando pago: ' + err.message)
    });
  }

  /* =====================================================
     CREAR / EDITAR
     ===================================================== */
  abrirCrearPoliza(): void {
    this.formMode     = 'crear';
    this.formData     = {};
    this.tipoPlanActual = '';
    this.showFormModal = true;
  }

  abrirEditarPoliza(p: PolicyWithRels): void {
    this.formMode = 'editar';

    // Datos básicos
    this.formData = {
      id:            p.id,
      policy_number: p.policy_number,
      client_id:     p.client_id,
      plan_id:       p.plan_id,
      status:        p.status,
      start_date:    p.start_date,
      end_date:      p.end_date,
      total_premium: p.total_premium
    };

    // Cargar metadatos y abrir modal
    this.api.getPolicyMetadata(p.id).subscribe(md => {
      this.formData = { ...this.formData, ...md };
      this.tipoPlanActual = p.plan?.name.toLowerCase() ?? '';
      this.showFormModal  = true;
    });
  }

  guardarPoliza(): void {
    /* -------- validación mínima -------- */
    if (!this.formData.policy_number || !this.formData.client_id || !this.formData.plan_id || !this.formData.status) {
      alert('Completa los campos obligatorios');
      return;
    }

    /* -------- payload principal -------- */
    const policyPayload: Partial<Policy> = {
      client_id:      this.formData.client_id,
      plan_id:        this.formData.plan_id,
      policy_number:  this.formData.policy_number,
      start_date:     this.formData.start_date,
      end_date:       this.formData.end_date,
      total_premium:  this.formData.total_premium,
      status:         this.formData.status
    };

    /* -------- payload metadata -------- */
    const metadata: Record<string, any> = {};
    switch (this.tipoPlanActual) {
      case 'auto':
        metadata['auto_placa'] = this.formData.extra_auto_placa;
        break;
      case 'vida':
        metadata['vida_beneficiarios'] = this.formData.extra_vida_beneficiarios;
        break;
      case 'hogar':
        metadata['hogar_valor_vivienda'] = this.formData.extra_hogar_valor_vivienda;
        break;
      case 'viaje':
        metadata['viaje_pais_origen']  = this.formData.extra_viaje_pais_origen;
        metadata['viaje_pais_destino'] = this.formData.extra_viaje_pais_destino;
        break;
    }

    /* -------- llamada create / update -------- */
    const obs$ = this.formMode === 'crear'
      ? this.api.createPolicy(policyPayload)
      : this.api.updatePolicy(this.formData.id!, policyPayload);

    obs$.subscribe({
      next: (createdOrUpdated) => {
        /* Si es crear → createdOrUpdated contiene el nuevo id */
        const policyId = this.formMode === 'crear'
          ? (createdOrUpdated as Policy).id
          : this.formData.id!;

        // Enviar metadatos (vacío o no, da igual) y refrescar
        this.api.updatePolicyMetadata(policyId, metadata).subscribe({
          next: () => {
            this.toast.success('Póliza guardada');
            this.showFormModal = false;
            this.cargarDatos();   // refrescar lista y KPI
          },
          error: err => alert('Error guardando metadata: ' + err.message)
        });
      },
      error: err => alert('Error guardando póliza: ' + err.message)
    });
  }

  /* =====================================================
     ELIMINAR
     ===================================================== */
  eliminarPoliza(p: Policy): void {
    if (!confirm(`¿Eliminar póliza ${p.policy_number}?`)) return;
    this.api.deletePolicy(p.id).subscribe({
      next: () => {
        this.policies = this.policies.filter(x => x.id !== p.id);
        this.calcularKpi();
      },
      error: err => alert('No se pudo eliminar: ' + err.message)
    });
  }

  /* =====================================================
     GETTER UX: tipoPlan según selección en modal
     ===================================================== */
  get tipoSeguro(): string {
    const plan = this.planes.find(pl => pl.id === this.formData.plan_id);
    return plan?.name?.toLowerCase() ?? this.tipoPlanActual;
  }

  // Métodos adicionales para el componente de Pólizas

  /**
   * Obtiene las iniciales del cliente para el avatar
   */
  getClientInitials(client: any): string {
    if (!client) return '??';
    const firstName = client.first_name || '';
    const lastName = client.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  /**
   * Obtiene el ícono apropiado para cada KPI
   */
  getKpiIcon(key: string): string {
    const icons: { [key: string]: string } = {
      'total': 'shield-alt',
      'active': 'check-circle',
      'pending': 'clock',
      'late': 'exclamation-triangle',
      'cancelled': 'times-circle'
    };
    return icons[key] || 'shield-alt';
  }

  /**
   * Obtiene el ícono apropiado para cada estado de póliza
   */
  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'ACTIVE': 'check-circle',
      'PENDING': 'clock',
      'LATE': 'exclamation-triangle',
      'CANCELLED': 'times-circle'
    };
    return icons[status] || 'question-circle';
  }

  /**
   * Obtiene el ícono apropiado para cada estado de pago
   */
  getPaymentStatusIcon(status: string | undefined): string {
    const icons: Record<string, string> = {
      PAID: 'check-circle',
      PENDING: 'clock',
      LATE: 'exclamation-triangle',
      CANCELLED: 'times-circle'
    };

    // Si status es undefined usamos cadena vacía, luego devolvemos fallback
    return icons[status ?? ''] ?? 'question-circle';
  }
}
