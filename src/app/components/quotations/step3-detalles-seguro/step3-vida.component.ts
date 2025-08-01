import { Component, EventEmitter, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VidaFormData {
  genero: string;
  estadoCivil: string;
  profesion: string;
  enfermedades: string;
  fuma: boolean;
  alcohol: boolean;
  deporte: boolean;
  discapacidad: boolean;
  enfermedadesFamiliares: boolean;
  hospitalizaciones: boolean;
}

@Component({
  selector: 'app-step3-vida',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step3-vida.component.html',
  styleUrls: ['./step3-vida.component.scss']
})
export class Step3VidaComponent {
  @Output() prev = new EventEmitter<void>();
  @Output() continuar = new EventEmitter<VidaFormData>();

  vidaForm = signal<VidaFormData>({
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

  // Computed para validación del formulario
  formEsValido(): boolean {
    const form = this.vidaForm();
    return !!(
      form.genero.trim() &&
      form.estadoCivil.trim() &&
      form.profesion.trim()
    );
  }

  // Computed para obtener el nivel de riesgo estimado
  riskLevel = computed(() => {
    const form = this.vidaForm();
    let riskScore = 0;

    if (form.fuma) riskScore += 3;
    if (form.alcohol) riskScore += 1;
    if (form.deporte) riskScore += 2;
    if (form.discapacidad) riskScore += 2;
    if (form.enfermedadesFamiliares) riskScore += 2;
    if (form.hospitalizaciones) riskScore += 2;

    if (riskScore === 0) return 'bajo';
    if (riskScore <= 3) return 'medio';
    if (riskScore <= 6) return 'alto';
    return 'muy-alto';
  });

  retroceder(): void {
    this.prev.emit();
  }

  siguientePaso(): void {
    if (this.formEsValido()) {
      this.continuar.emit(this.vidaForm());
    }
  }

  // Método para limpiar el formulario si es necesario
  limpiarFormulario(): void {
    this.vidaForm.set({
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
  }

  // Método para actualizar un campo específico
  actualizarCampo<K extends keyof VidaFormData>(campo: K, valor: VidaFormData[K]): void {
    this.vidaForm.update(form => ({
      ...form,
      [campo]: valor
    }));
  }
}
