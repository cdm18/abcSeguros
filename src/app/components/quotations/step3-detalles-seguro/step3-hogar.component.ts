/* -------------------------------------------------------------
   Paso 3 – Seguro de HOGAR
   ------------------------------------------------------------- */
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { SeguroHogar }  from '../../../models/insurance-details.model';

@Component({
  selector   : 'app-step3-hogar',
  standalone : true,
  imports    : [CommonModule, FormsModule],
  templateUrl: './step3-hogar.component.html',
  styleUrls  : ['./step3-hogar.component.scss']
})
export class Step3HogarComponent {

  /* -----------------------------------------------------------
     Event API
     ----------------------------------------------------------- */
  /** ← paso anterior del wizard */
  @Output() prev       = new EventEmitter<void>();
  /** → continuar; enviamos el objeto completo */
  @Output() continuar  = new EventEmitter<SeguroHogar>();

  /* -----------------------------------------------------------
     Estado (Signal)
     ----------------------------------------------------------- */
  hogarForm = signal<SeguroHogar>({
    tipoPropiedad    : '',
    direccion        : '',
    ciudad           : '',
    metrosConstruidos: 100,
    pisos            : 1,
    valorContenido   : 25000,
    valorPropiedad   : 150000
  });

  /* -----------------------------------------------------------
     Métodos
     ----------------------------------------------------------- */
  siguientePaso() {
    // Validación básica antes de continuar
    const form = this.hogarForm();

    if (!form.tipoPropiedad || !form.direccion || !form.ciudad) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (form.metrosConstruidos < 20 || form.metrosConstruidos > 2000) {
      alert('Los metros construidos deben estar entre 20 y 2000 m²');
      return;
    }

    if (form.valorContenido < 1000) {
      alert('El valor del contenido debe ser al menos $1,000 USD');
      return;
    }

    if (form.valorPropiedad < 10000) {
      alert('El valor de la propiedad debe ser al menos $10,000 USD');
      return;
    }

    // Validación lógica: el contenido no debería valer más que la propiedad
    if (form.valorContenido > form.valorPropiedad) {
      const confirmar = confirm(
        'El valor del contenido es mayor al valor de la propiedad. ¿Está seguro de continuar?'
      );
      if (!confirmar) return;
    }

    this.continuar.emit(this.hogarForm());
  }

  retroceder() {
    this.prev.emit();
  }

  // Método helper para actualizar el formulario
  updateForm(field: keyof SeguroHogar, value: any) {
    this.hogarForm.update(current => ({
      ...current,
      [field]: value
    }));
  }

  // Método para formatear valores monetarios
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  }
}
