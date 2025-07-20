import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step3-auto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step3-auto.component.html',
  styleUrls: ['./step3-auto.component.scss']
})
export class Step3AutoComponent {
  @Output() continuar = new EventEmitter<any>();

  autoForm = signal({
    tipoVehiculo: '',
    matricula: '',
    anioVehiculo: '',
    marcaVehiculo: '',
    modeloVehiculo: '',
    tipoCombustible: '',
    cobertura: '',
    asistenciaVial: false,
    vehiculoSustituto: false
  });

  siguientePaso() {
    this.continuar.emit(this.autoForm());
  }
}
