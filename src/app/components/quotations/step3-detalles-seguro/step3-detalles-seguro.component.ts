import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule }  from '@angular/common';

import { Step3AutoComponent }  from './step3-auto.component';
import { Step3HogarComponent } from './step3-hogar.component';
import { Step3ViajeComponent } from './step3-viaje.component';
import { Step3VidaComponent }  from './step3-vida.component';

@Component({
  selector   : 'app-step3-detalles-seguro',
  standalone : true,
  imports    : [
    CommonModule,
    Step3AutoComponent,
    Step3HogarComponent,
    Step3ViajeComponent,
    Step3VidaComponent
  ],
  templateUrl: './step3-detalles-seguro.component.html',
  styleUrls  : ['./step3-detalles-seguro.component.scss']
})
export class Step3DetallesSeguroComponent {

  /** id del plan base elegido en el paso 2 */
  @Input()  tipoSeguro!: number;

  /** navegación del wizard */
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<any>();   // payload del sub-formulario seleccionado
}
