import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanBase } from '../../../models/plan-base.model';

@Component({
  selector: 'app-step2-tipo-seguro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step2-tipo-seguro.component.html',
  styleUrls: ['./step2-tipo-seguro.component.scss']
})
export class Step2TipoSeguroComponent {
  @Input() plans: PlanBase[] = [];
  @Input() selectedPlanId: number = 0;
  @Output() selectedPlanIdChange = new EventEmitter<number>();
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  showValidationError = false;

  // Método para seleccionar un plan al hacer click en la tarjeta
  selectPlan(planId: number) {
    this.selectedPlanId = Number(planId);
    this.showValidationError = false;
    this.selectedPlanIdChange.emit(this.selectedPlanId);
  }

  onPlanSelect(planId: number) {
    this.selectedPlanId = Number(planId);
    this.showValidationError = false;
    this.selectedPlanIdChange.emit(this.selectedPlanId);
  }

  continuar() {
    if (this.selectedPlanId > 0) {
      this.showValidationError = false;
      this.selectedPlanIdChange.emit(this.selectedPlanId);
      this.next.emit();
    } else {
      this.showValidationError = true;
      // Scroll hacia arriba para mostrar el error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  retroceder() {
    this.prev.emit();
  }

  // Método helper para obtener el plan seleccionado
  get selectedPlan(): PlanBase | undefined {
    return this.plans.find(plan => plan.id === this.selectedPlanId);
  }
}
