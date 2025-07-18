import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step1-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step1-datos-personales.component.html'
})
export class Step1DatosPersonalesComponent {
  @Input() datosCliente!: any;
  @Output() guardar = new EventEmitter<void>();

  continuar() {
    this.guardar.emit();
  }
}
