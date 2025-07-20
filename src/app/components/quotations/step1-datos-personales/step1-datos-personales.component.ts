import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step1-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step1-datos-personales.component.html',
  styleUrls: ['./step1-datos-personales.component.scss']
})
export class Step1DatosPersonalesComponent {
  @Input() datosCliente!: any;
  @Output() guardar = new EventEmitter<void>();

  continuar() {
    // Validar datos antes de continuar
    if (this.isValidForm()) {
      this.guardar.emit();
    }
  }

  private isValidForm(): boolean {
    return !!(
      this.datosCliente.nombres &&
      this.datosCliente.apellidos &&
      this.datosCliente.correo &&
      this.datosCliente.telefono
    );
  }
}
