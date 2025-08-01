import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeguroViaje }  from '../../../models/insurance-details.model';

@Component({
  selector: 'app-step3-viaje',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step3-viaje.component.html',
  styleUrls: ['./step3-viaje.component.scss']
})
export class Step3ViajeComponent {
  @Output() prev      = new EventEmitter<void>();
  @Output() continuar = new EventEmitter<void>();


  viajeForm = signal<SeguroViaje>({
    fechaInicio    : '',
    fechaFin       : '',
    destino        : '',
    paisResidencia : '',
    motivo         : '',
    cobertura      : ''
  });

  // Validación personalizada para las fechas
  validateDates(): boolean {
    const fechaInicio = new Date(this.viajeForm().fechaInicio);
    const fechaFin = new Date(this.viajeForm().fechaFin);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // La fecha de inicio debe ser hoy o en el futuro
    if (fechaInicio < today) {
      return false;
    }

    // La fecha de fin debe ser después de la fecha de inicio
    if (fechaFin <= fechaInicio) {
      return false;
    }

    return true;
  }

  // Actualizar el formulario
  updateForm(field: string, value: string) {
    this.viajeForm.update(form => ({
      ...form,
      [field]: value
    }));
  }

  retroceder()   { this.prev.emit();      }
  siguientePaso(){ this.continuar.emit(); }

  // Método para obtener la fecha mínima (hoy)
  get minDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Método para obtener la fecha mínima de fin (día después del inicio)
  get minEndDate(): string {
    if (this.viajeForm().fechaInicio) {
      const startDate = new Date(this.viajeForm().fechaInicio);
      startDate.setDate(startDate.getDate() + 1);
      return startDate.toISOString().split('T')[0];
    }
    return this.minDate;
  }

  // Método para calcular la duración del viaje
  get duracionViaje(): number {
    if (this.viajeForm().fechaInicio && this.viajeForm().fechaFin) {
      const fechaInicio = new Date(this.viajeForm().fechaInicio);
      const fechaFin = new Date(this.viajeForm().fechaFin);
      const diffTime = Math.abs(fechaFin.getTime() - fechaInicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }

  // Método para validar si el formulario está completo
  get isFormValid(): boolean {
    const form = this.viajeForm();
    return !!(
      form.fechaInicio &&
      form.fechaFin &&
      form.destino &&
      form.paisResidencia &&
      form.motivo &&
      form.cobertura &&
      this.validateDates()
    );
  }
}
