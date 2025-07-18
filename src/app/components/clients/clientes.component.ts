import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule], // Agregar esto para usar *ngIf y *ngFor
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  clientes: Client[] = [];
  cargando: boolean = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getClients().subscribe({
      next: (res) => {
        this.clientes = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener clientes:', err);
        this.cargando = false;
      }
    });
  }
}
