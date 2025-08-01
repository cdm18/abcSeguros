// src/app/components/quotations/step3-detalles-seguro/step3-detalles-seguro.component.ts
import {
  Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanBaseService } from '../../../services/plan-base.service';
import { Step3AutoComponent }  from './step3-auto.component';
import { Step3HogarComponent } from './step3-hogar.component';
import { Step3ViajeComponent } from './step3-viaje.component';
import { Step3VidaComponent }  from './step3-vida.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector    : 'app-step3-detalles-seguro',
  standalone  : true,
  imports     : [
    CommonModule, FormsModule,
    Step3AutoComponent, Step3HogarComponent,
    Step3ViajeComponent, Step3VidaComponent
  ],
  templateUrl : './step3-detalles-seguro.component.html',
  styleUrls   : ['./step3-detalles-seguro.component.scss']
})
export class Step3DetallesSeguroComponent implements OnChanges {

  /** ID del plan base seleccionado en el paso 2 */
  @Input() tipoSeguro!: number;

  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  /** Código normalizado que controla el *ngSwitch* */
  readonly planCode = signal<string>('');   // '' ▸ aún sin resolver

  constructor(private planService: PlanBaseService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipoSeguro'] && this.tipoSeguro) {
      this.planService.getBasePlanById(this.tipoSeguro).subscribe({
        next : plan => this.planCode.set(this.normalizeCode(plan.code)),
        error: ()   => this.planCode.set('DESCONOCIDO')
      });
    }
  }

  /* ------------------------------------------------------------------ */
  /*  MÉTODOS AUXILIARES                                                 */
  /* ------------------------------------------------------------------ */
  normalizeCode(raw: string): string {
    const up = (raw ?? '').toUpperCase();
    if (up.startsWith('AUTO'))  return 'AUTO';
    if (up.startsWith('HOG'))   return 'HOGAR';
    if (up.startsWith('VIA'))   return 'VIAJE';
    if (up.startsWith('VID'))   return 'VIDA';
    return 'DESCONOCIDO';
  }

  /* Pasarela de eventos */
  emitirPrev() { this.prev.emit(); }
  emitirNext() { this.next.emit(); }
}
