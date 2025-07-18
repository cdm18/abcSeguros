/* ============================================================================
   COTIZACIONES COMPONENT
   Maneja listado, creación (wizard) y edición de cotizaciones
   ============================================================================ */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { switchMap, forkJoin, map, catchError, of, finalize } from 'rxjs';

// Services
import { ApiService } from '../../services/api.service';
import { PlanBaseService } from '../../services/plan-base.service';

// Models
import { Client } from '../../models/client.model';
import { PlanBase } from '../../models/plan-base.model';
import { PlanOption } from '../../models/plan-option.model';
import { Quotation, QuotationStatus } from '../../models/quotation.model';

// Components
import { Step1DatosPersonalesComponent } from '../dashboard/step1-datos-personales/step1-datos-personales.component';
import { Step2TipoSeguroComponent } from '../dashboard/step2-tipo-seguro/step2-tipo-seguro.component';
import { Step3DetallesSeguroComponent } from '../dashboard/step3-detalles-seguro/step3-detalles-seguro.component';
import { Step4CompararOpcionesComponent } from '../dashboard/step4-comparar-opciones/step4-comparar-opciones.component';
import { Step5ResumenCotizacionComponent } from '../dashboard/step5-resumen-cotizacion/step5-resumen-cotizacion.component';

// Types
type Mode = 'list' | 'wizard' | 'edit';

interface QuotationWithRelations extends Quotation {
  client?: Client;
  plan?: PlanBase;
}

interface DatosCliente {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  fechaNacimiento: string;
  ciudad: string;
  ocupacion: string;
  ingresos: string;
  direccion: string;
}

interface EditData {
  client_id?: number;
  plan_id?: number;
  plan_option_id?: number | null;
  quote_amount?: number;
  status?: QuotationStatus;
}

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Step1DatosPersonalesComponent,
    Step2TipoSeguroComponent,
    Step3DetallesSeguroComponent,
    Step4CompararOpcionesComponent,
    Step5ResumenCotizacionComponent
  ],
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss']
})
export class CotizacionesComponent implements OnInit {

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // PROPIEDADES GENERALES
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  mode: Mode = 'list';
  isProcessing = false;

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // PROPIEDADES PARA EL LISTADO
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  loadingList = true;
  quotations: QuotationWithRelations[] = [];

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // PROPIEDADES PARA EL WIZARD
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  step = 1;
  plans: PlanBase[] = [];
  tipoSeguro = 0;
  selectedPlanOption?: PlanOption;

  datosCliente: DatosCliente = {
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    fechaNacimiento: '',
    ciudad: '',
    ocupacion: '',
    ingresos: '',
    direccion: ''
  };

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // PROPIEDADES PARA LA EDICIÓN
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  editLoading = true;
  editingId = 0;
  selectedClient?: Client;
  planOptions: PlanOption[] = [];
  editData: EditData = {};

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // CONSTRUCTOR E INYECCIÓN DE DEPENDENCIAS
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  constructor(
    private api: ApiService,
    private planService: PlanBaseService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // LIFECYCLE HOOKS
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    this.determineMode();
  }

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // MÉTODOS PRIVADOS DE INICIALIZACIÓN
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  private determineMode(): void {
    // Intenta leer parámetro ID de la URL
    let idParam = this.route.snapshot.paramMap.get('id');

    // Fallback para URL del tipo "cotizaciones/editar/9"
    if (!idParam) {
      const segments = this.route.snapshot.url;
      idParam = segments.length >= 3 && segments[segments.length - 2].path === 'editar'
        ? segments[segments.length - 1].path
        : null;
    }

    // Determina el modo según la URL
    if (this.route.snapshot.url.some(segment => segment.path === 'nueva')) {
      this.initializeWizardMode();
    } else if (idParam) {
      this.initializeEditMode(+idParam);
    } else {
      this.initializeListMode();
    }
  }

  private initializeListMode(): void {
    this.mode = 'list';
    this.loadQuotationsList();
  }

  private initializeWizardMode(): void {
    this.mode = 'wizard';
    this.loadPlansForWizard();
  }

  private initializeEditMode(id: number): void {
    this.mode = 'edit';
    this.editingId = id;
    this.loadEditData();
  }

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // MÉTODOS PARA EL LISTADO
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  private loadQuotationsList(): void {
    this.loadingList = true;

    forkJoin({
      quotations: this.api.getQuotations(),
      clients: this.api.getClients(),
      plans: this.api.getPlans().pipe(catchError(() => of([] as PlanBase[])))
    }).pipe(
      map(({ quotations, clients, plans }) => {
        const clientsMap = new Map(clients.map(client => [client.id, client]));
        const plansMap = new Map(plans.map(plan => [plan.id, plan]));

        return quotations.map(quotation => ({
          ...quotation,
          client: clientsMap.get(quotation.client_id),
          plan: plansMap.get(quotation.plan_id)
        }));
      }),
      finalize(() => this.loadingList = false)
    ).subscribe({
      next: (quotationsWithRelations) => {
        this.quotations = quotationsWithRelations;
      },
      error: (error) => {
        console.error('Error loading quotations:', error);
        this.quotations = [];
      }
    });
  }

  irCrear(): void {
    this.router.navigate(['/cotizaciones/nueva']);
  }

  editar(quotation: Quotation): void {
    this.router.navigate(['/cotizaciones/editar', quotation.id]);
  }

  eliminar(quotation: Quotation): void {
    const confirmMessage = `¿Está seguro de que desea eliminar la cotización #${quotation.id}?`;

    if (confirm(confirmMessage)) {
      this.api.deleteQuotation(quotation.id).subscribe({
        next: () => {
          this.loadQuotationsList();
        },
        error: (error) => {
          console.error('Error deleting quotation:', error);
          alert('Error al eliminar la cotización');
        }
      });
    }
  }

  trackQuotation(index: number, quotation: Quotation): number {
    return quotation.id;
  }

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // MÉTODOS PARA LA EDICIÓN
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  private loadEditData(): void {
    this.editLoading = true;

    this.api.getQuotation(this.editingId).pipe(
      switchMap(quotation => {
        // Guarda los campos editables
        this.editData = {
          client_id: quotation.client_id,
          plan_id: quotation.plan_id,
          plan_option_id: quotation.plan_option_id ?? null,
          quote_amount: quotation.quote_amount,
          status: quotation.status
        };

        // Carga datos relacionados en paralelo
        return forkJoin({
          client: this.api.getClient(quotation.client_id),
          plan: this.api.getPlan(quotation.plan_id),
          options: this.api.getPlanOptionsByBase(quotation.plan_id)
            .pipe(catchError(() => of([] as PlanOption[])))
        });
      }),
      finalize(() => this.editLoading = false)
    ).subscribe({
      next: ({ client, plan, options }) => {
        this.selectedClient = client;
        this.plans = [plan];
        this.planOptions = options;
      },
      error: (error) => {
        console.error('Error loading edit data:', error);
        alert('No se pudo cargar la información de la cotización');
        this.router.navigate(['/cotizaciones']);
      }
    });
  }

  guardarEdicion(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;

    this.api.updateQuotation(this.editingId, this.editData).pipe(
      finalize(() => this.isProcessing = false)
    ).subscribe({
      next: () => {
        alert('Cotización actualizada exitosamente');
        this.router.navigate(['/cotizaciones']);
      },
      error: (error) => {
        console.error('Error updating quotation:', error);
        alert('Error al actualizar la cotización: ' + error.message);
      }
    });
  }

  getPlanName(planId?: number): string {
    if (!planId) return '—';
    return this.plans.find(plan => plan.id === planId)?.name ?? '—';
  }

  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // MÉTODOS PARA EL WIZARD
  // ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

  private loadPlansForWizard(): void {
    this.planService.getBasePlans().subscribe({
      next: (plans) => {
        this.plans = plans;
      },
      error: (error) => {
        console.error('Error loading plans:', error);
        this.plans = [];
      }
    });
  }

  avanzar(): void {
    if (this.step < 5) {
      this.step++;
    }
  }

  retroceder(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  recibirOpcionSeleccionada(option: PlanOption): void {
    this.selectedPlanOption = option;
    this.avanzar();
  }

  validarDatosPaso1(): void {
    // Validación de datos del paso 1
    const { nombres, apellidos, correo, telefono } = this.datosCliente;

    if (!nombres.trim() || !apellidos.trim() || !correo.trim() || !telefono.trim()) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Validación básica de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(correo)) {
      alert('Por favor ingrese un email válido');
      return;
    }

    this.avanzar();
  }

  finalizarCotizacion(): void {
    if (this.isProcessing) return;

    this.isProcessing = true;

    // Aquí iría la lógica para finalizar la cotización
    // Por ejemplo, enviar los datos al servidor
    console.log('Finalizando cotización:', {
      cliente: this.datosCliente,
      plan: this.planBaseSeleccionado,
      option: this.selectedPlanOption
    });

    // Simular procesamiento
    setTimeout(() => {
      this.isProcessing = false;
      alert('Cotización enviada exitosamente');
      this.router.navigate(['/cotizaciones']);
    }, 2000);
  }

  getStepTitle(step: number): string {
    const titles = {
      1: 'Datos Personales',
      2: 'Tipo de Seguro',
      3: 'Detalles del Seguro',
      4: 'Comparar Opciones',
      5: 'Resumen Final'
    };
    return titles[step as keyof typeof titles] || '';
  }

  get planBaseSeleccionado(): PlanBase | undefined {
    return this.plans.find(plan => plan.id === this.tipoSeguro);
  }
}
