import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step3-viaje',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step3-viaje.component.html',
  styleUrls: ['./step3-viaje.component.scss']
})
export class Step3ViajeComponent {
  @Output() continuar = new EventEmitter<any>();

  viajeForm = signal({
    fechaInicio: '',
    fechaFin: '',
    destino: '',
    paisResidencia: '',
    motivoViaje: '',
    cobertura: ''
  });

  siguientePaso() {
    this.continuar.emit(this.viajeForm());
  }
}
