import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanOption } from '../../../models/plan-option.model';
import { PlanOptionsService } from '../../../services/plan-options.service';

@Component({
  selector   : 'app-step4-comparar-opciones',
  standalone : true,
  imports    : [CommonModule],
  templateUrl: './step4-comparar-opciones.component.html',
  styleUrls  : ['./step4-comparar-opciones.component.scss']
})
export class Step4CompararOpcionesComponent implements OnChanges {

  /* plan base seleccionado (id) */
  @Input()  planBaseId!: number;

  /* navegación */
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<PlanOption>();

  /* datos de la vista */
  planOptions: PlanOption[] = [];
  selectedOption?: PlanOption;

  constructor(private planOptionsSvc: PlanOptionsService) {}   // ← renombrado

  ngOnChanges() { this.cargarOpciones(); }

  private cargarOpciones(): void {
    if (!this.planBaseId) { this.planOptions = []; return; }

    this.planOptionsSvc.getOptionsByBasePlanId(this.planBaseId).subscribe({
      next : (ops: PlanOption[]) => this.planOptions = ops,
      error: (err: unknown)      => console.error('❌ Error cargando opciones:', err)
    });
  }

  seleccionarOpcion(p: PlanOption) { this.selectedOption = p; }

  continuar() {
    if (!this.selectedOption) { alert('Selecciona una opción'); return; }
    this.next.emit(this.selectedOption);
  }

  retroceder() { this.prev.emit(); }
}
