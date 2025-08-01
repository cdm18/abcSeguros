import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { SeguroAuto }   from '../../../models/insurance-details.model';

@Component({
  selector    : 'app-step3-auto',
  standalone  : true,
  imports     : [CommonModule, FormsModule],
  templateUrl : './step3-auto.component.html',
  styleUrls   : ['./step3-auto.component.scss']
})
export class Step3AutoComponent {
  @Output() continuar = new EventEmitter<SeguroAuto>();
  @Output() prev       = new EventEmitter<void>();

  autoForm = signal<SeguroAuto>({
    tipoVehiculo     : '',
    matricula        : '',
    anio             : new Date().getFullYear(),
    marca            : '',
    modelo           : '',
    tipoCombustible  : '',
    cobertura        : '',
    asistenciaVial   : false,
    vehiculoSustituto: false
  });

  siguientePaso() {
    // Validación básica antes de continuar
    const form = this.autoForm();

    if (!form.tipoVehiculo || !form.matricula || !form.marca ||
      !form.modelo || !form.tipoCombustible || !form.cobertura) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (form.anio < 1990 || form.anio > new Date().getFullYear() + 1) {
      alert('Por favor ingrese un año válido para el vehículo');
      return;
    }

    this.continuar.emit(this.autoForm());
  }

  retroceder() {
    this.prev.emit();
  }

  // Método helper para actualizar el formulario
  updateForm(field: keyof SeguroAuto, value: any) {
    this.autoForm.update(current => ({
      ...current,
      [field]: value
    }));
  }
}
