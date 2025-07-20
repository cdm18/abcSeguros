import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanBase }   from '../../../models/plan-base.model';
import { PlanOption } from '../../../models/plan-option.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector   : 'app-step5-resumen-cotizacion',
  standalone : true,
  imports    : [CommonModule],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('250ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  templateUrl: './step5-resumen-cotizacion.component.html',
  styleUrls  : ['./step5-resumen-cotizacion.component.scss']
})
export class Step5ResumenCotizacionComponent {

  /* -------- datos que recibe -------- */
  @Input() cliente!: {
    nombres: string; apellidos: string; correo: string; telefono: string;
    ciudad: string;  ocupacion: string; ingresos: number | string;
  };

  @Input() isProcessing = false;   // ← para desactivar mientras se procesa


  @Input() planBase!:  PlanBase | undefined;
  @Input() planOption!: PlanOption | undefined;

  /* -------- navegación -------- */
  @Output() prev = new EventEmitter<void>();
  @Output() enviar = new EventEmitter<void>();   // ← NUEVO
  @Output() enviarCotizacion = new EventEmitter<void>();

  volver() { this.prev.emit(); }

}
