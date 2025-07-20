import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  clientes: Client[] = [];
  cargando: boolean = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  /**
   * Cargar lista de clientes desde la API
   */
  private cargarClientes(): void {
    this.cargando = true;

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

  /**
   * Generar iniciales para el avatar del cliente
   * @param firstName - Nombre del cliente
   * @param lastName - Apellido del cliente
   * @returns Iniciales del nombre y apellido
   */
  getInitials(firstName: string, lastName: string): string {
    if (!firstName && !lastName) {
      return '??';
    }

    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

    return `${firstInitial}${lastInitial}`.padEnd(2, '?');
  }

  /**
   * Formatear teléfono para mostrar
   * @param phone - Número de teléfono
   * @returns Teléfono formateado
   */
  formatPhone(phone: string): string {
    if (!phone) return '';

    // Remover caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');

    // Formato para números ecuatorianos (ejemplo: +593 99 123 4567)
    if (cleaned.length === 13 && cleaned.startsWith('593')) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }

    // Formato para números locales (ejemplo: 099 123 4567)
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }

    return phone; // Devolver original si no coincide con patrones conocidos
  }

  /**
   * Verificar si el email es válido
   * @param email - Email a verificar
   * @returns true si el email es válido
   */
  isValidEmail(email: string): boolean {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Obtener el dominio del email
   * @param email - Email del cliente
   * @returns Dominio del email
   */
  getEmailDomain(email: string): string {
    if (!email || !this.isValidEmail(email)) return '';
    return email.split('@')[1];
  }

  /**
   * Recargar la lista de clientes
   */
  recargarClientes(): void {
    this.cargarClientes();
  }

  /**
   * Obtener estadísticas básicas de los clientes
   */
  getClientStats() {
    const total = this.clientes.length;
    const conTelefono = this.clientes.filter(c => c.phone && c.phone.trim()).length;
    const conDireccion = this.clientes.filter(c => c.address && c.address.trim()).length;

    return {
      total,
      conTelefono,
      conDireccion,
      sinTelefono: total - conTelefono,
      sinDireccion: total - conDireccion
    };
  }
}
