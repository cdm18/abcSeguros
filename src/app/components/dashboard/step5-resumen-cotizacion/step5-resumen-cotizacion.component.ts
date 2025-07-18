import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanBase }   from '../../../models/plan-base.model';
import { PlanOption } from '../../../models/plan-option.model';

@Component({
  selector   : 'app-step5-resumen-cotizacion',
  standalone : true,
  imports    : [CommonModule],
  templateUrl: './step5-resumen-cotizacion.component.html',
  styleUrls  : ['./step5-resumen-cotizacion.component.scss']
})
export class Step5ResumenCotizacionComponent {

  /* -------- datos que recibe -------- */
  @Input() cliente!: {
    nombres: string; apellidos: string; correo: string; telefono: string;
    ciudad: string;  ocupacion: string; ingresos: number | string;
  };

  @Input() planBase!:  PlanBase | undefined;
  @Input() planOption!: PlanOption | undefined;

  /* -------- navegación -------- */
  @Output() prev = new EventEmitter<void>();
  volver() { this.prev.emit(); }
}
