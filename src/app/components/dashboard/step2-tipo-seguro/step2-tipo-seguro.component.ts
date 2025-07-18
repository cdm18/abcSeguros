import { Component, EventEmitter, Input, Output } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {PlanBase} from "../../../models/plan-base.model";

@Component({
  selector: 'app-step2-tipo-seguro',
  standalone: true,
  imports: [CommonModule, FormsModule],  // FormsModule si usas [(ngModel)]
  templateUrl: './step2-tipo-seguro.component.html',
})
export class Step2TipoSeguroComponent {
  @Input() plans: PlanBase[] = [];
  @Input() selectedPlanId: number = 0;
  @Output() selectedPlanIdChange = new EventEmitter<number>();
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  continuar() {
    this.selectedPlanIdChange.emit(this.selectedPlanId);
    this.next.emit();
  }
  retroceder() {
    this.prev.emit();
  }
}
