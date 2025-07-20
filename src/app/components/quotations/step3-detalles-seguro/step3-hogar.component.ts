import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step3-hogar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step3-hogar.component.html',
  styleUrls: ['./step3-hogar.component.scss']
})
export class Step3HogarComponent {
  @Output() continuar = new EventEmitter<any>();

  hogarForm = signal({
    tipoPropiedad: '',
    direccion: '',
    ciudad: '',
    metrosCuadrados: '',
    pisos: '',
    valorContenido: '',
    valorPropiedad: ''
  });

  siguientePaso() {
    this.continuar.emit(this.hogarForm());
  }
}
