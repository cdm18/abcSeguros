import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-step3-vida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step3-vida.component.html',
  styleUrls: ['./step3-vida.component.scss']
})
export class Step3VidaComponent {
  @Output() continuar = new EventEmitter<any>();

  vidaForm = signal({
    genero: '',
    estadoCivil: '',
    profesion: '',
    enfermedades: '',
    fuma: false,
    alcohol: false,
    deporte: false,
    discapacidad: false,
    enfermedadesFamiliares: false,
    hospitalizaciones: false
  });

  siguientePaso() {
    this.continuar.emit(this.vidaForm());
  }
}
