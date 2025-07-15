import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgClass } from '@angular/common';
import { Summary, Client } from '../../services/api';

@Component({
  selector   : 'app-dashboard-cards',
  standalone : true,
  imports    : [CommonModule, NgFor, NgIf, NgClass],
  templateUrl: './dashboard-cards.html',
  styleUrls  : ['./dashboard-cards.css']
})
export class DashboardCardsComponent {
  @Input() summary!: Summary|undefined;
  @Input() clients: Client[] = [];
  @Input() loading = true;

  @Output() newClient = new EventEmitter<void>();
  @Output() generateReport = new EventEmitter<void>();
  @Output() reminders = new EventEmitter<void>();

  trackByClientId(index: number, client: Client): number {
    return client.id;
  }

  getClientAvatar(clientId: number): string {
    return `https://i.pravatar.cc/40?u=${clientId}`;
  }

  getStatusClass(status: string | null | undefined): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning';
      case 'LATE':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getStatusText(status: string | null | undefined): string {
    switch (status) {
      case 'ACTIVE':
        return 'ACTIVO';
      case 'PENDING':
        return 'PENDIENTE';
      case 'LATE':
        return 'ATRASADO';
      default:
        return 'SIN ESTADO';
    }
  }

  onNewClient(): void {
    this.newClient.emit();
  }

  onGenerateReport(): void {
    this.generateReport.emit();
  }

  onReminders(): void {
    this.reminders.emit();
  }
}
