import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { PlanBaseService } from '../../services/plan-base.service';

import { PlanBase } from '../../models/plan-base.model';
import { PlanOption } from '../../models/plan-option.model';

import { Step1DatosPersonalesComponent } from '../dashboard/step1-datos-personales/step1-datos-personales.component';
import { Step2TipoSeguroComponent } from '../dashboard/step2-tipo-seguro/step2-tipo-seguro.component';
import { Step3DetallesSeguroComponent } from '../dashboard/step3-detalles-seguro/step3-detalles-seguro.component';
import { Step4CompararOpcionesComponent } from '../dashboard/step4-comparar-opciones/step4-comparar-opciones.component';
import { Step5ResumenCotizacionComponent } from '../dashboard/step5-resumen-cotizacion/step5-resumen-cotizacion.component';

@Component({
  selector: 'app-cotizaciones',
  standalone: true,
  imports    : [
    CommonModule, FormsModule,
    Step1DatosPersonalesComponent,
    Step2TipoSeguroComponent,
    Step3DetallesSeguroComponent,
    Step4CompararOpcionesComponent,
    Step5ResumenCotizacionComponent
  ],
  templateUrl: './cotizaciones.component.html',
  styleUrl: './cotizaciones.component.scss'
})
export class CotizacionesComponent {

  /* navegación */
  step = 1;

  /* datos cargados */
  plans: PlanBase[] = [];

  /* selección del usuario */
  tipoSeguro = 0;                   // id plan base
  selectedPlanOption?: PlanOption;  // opción elegida

  /* formularios */
  datosCliente = {
    nombres: '', apellidos: '', correo: '', telefono: '',
    fechaNacimiento: '', ciudad: '', ocupacion: '', ingresos: '', direccion: ''
  };

  constructor(private api: ApiService, private planBaseSvc: PlanBaseService) {
    this.planBaseSvc.getBasePlans().subscribe({
      next : planes => this.plans = planes,
      error: err    => console.error('Error al cargar planes base', err)
    });
  }

  /* -------- GETTER: plan base seleccionado -------- */
  get planBaseSeleccionado(): PlanBase | undefined {
    return this.plans.find(p => p.id === this.tipoSeguro);
  }

  /* ---------- navegación ---------- */
  avanzar()    { if (this.step < 5) this.step++; }
  retroceder() { if (this.step > 1) this.step--; }

  /* ---------- recibir opción del paso 4 ---------- */
  recibirOpcionSeleccionada(op: PlanOption) {
    this.selectedPlanOption = op;
    this.avanzar();
  }

  /* ---------- validar paso 1 ---------- */
  validarDatosPaso1(): void {
    const c = this.datosCliente;
    if (![c.nombres, c.apellidos, c.correo, c.telefono].every(v => v.trim())) {
      alert('Completa los campos obligatorios *'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.correo)) {
      alert('Correo inválido'); return;
    }
    this.avanzar();
  }

  /* ---------- guardar cliente + cotización ---------- */
  finalizarCotizacion(): void {

    /* 1. Cliente */
    const clienteBody = {
      first_name: this.datosCliente.nombres,
      last_name : this.datosCliente.apellidos,
      email     : this.datosCliente.correo,
      phone     : this.datosCliente.telefono,
      birth_date: this.datosCliente.fechaNacimiento,
      city      : this.datosCliente.ciudad,
      occupation: this.datosCliente.ocupacion,
      income    : Number(this.datosCliente.ingresos) || 0,
      address   : this.datosCliente.direccion
    };

    this.api.createClient(clienteBody).subscribe({
      next : (cli) => {

        /* 2. Cotización */
        const cotBody = {
          client_id      : cli.id as number,

          // siempre intentamos en este orden:
          // 1) getter planBaseSeleccionado
          // 2) base_plan_id que viene en la opción elegida
          // 3) this.tipoSeguro (por si acaso)
          plan_id        : this.planBaseSeleccionado?.id
            ?? this.selectedPlanOption?.base_plan_id
            ?? this.tipoSeguro,

          plan_option_id : this.selectedPlanOption?.id ?? null,
          quoted_by      : 1,
          quote_amount   : this.selectedPlanOption?.price_yearly ?? 0
        };

        console.log('COT BODY →', cotBody);

        this.api.createQuotation(cotBody).subscribe({
          next : ()  => alert('¡Cotización enviada con éxito!'),
          error: err => console.error('❌ Error al guardar cotización', err)
        });

      },
      error: err => console.error('❌ Error al guardar cliente', err)
    });
  }
}
