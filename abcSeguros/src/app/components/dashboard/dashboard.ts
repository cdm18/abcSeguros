import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { Sidebar } from '../sidebar/sidebar';
import { DashboardCardsComponent } from './dashboard-cards';
import { ApiService, Summary, Client, SearchItem } from '../../services/api';
import { AuthService } from '../../services/auth';
import {User} from '../../models/user';
import AOS from 'aos';
import {RouterModule} from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector   : 'app-dashboard',
  standalone : true,
  imports    : [
    CommonModule, NgFor, NgIf, ReactiveFormsModule,
    Sidebar, DashboardCardsComponent, RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styleUrls  : ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  user?: User;
  summary?: Summary;
  clients: Client[] = [];
  loading = true;
  error: string | null = null;
  term = new FormControl('');
  results: SearchItem[] = [];
  showDropdown = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeAOS();

    setTimeout(() => this.loadUserData(), 0);
    setTimeout(() => this.loadDashboardData(), 100);
    setTimeout(() => this.setupSearch(), 200);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeAOS() {
    AOS.init({
      duration: 700,
      once: true,
      offset: 100
    });
  }

  private loadUserData() {
    // Cargar usuario desde auth service
    this.auth.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.user = user || undefined;
      });

    // Obtener datos actualizados del usuario
    this.api.getMe()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.auth.setSession(user);
        },
        error: (error) => {
          console.error('Error cargando datos del usuario:', error);
        }
      });
  }

  private loadDashboardData() {
    this.loading = true;
    this.error = null;

    // Cargar resumen
    this.api.getSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (summary) => {
          this.summary = summary;
        },
        error: (error) => {
          console.error('Error cargando resumen:', error);
          this.error = 'Error al cargar el resumen';
        }
      });

    // Cargar clientes recientes
    this.api.getRecentClients(10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clients) => {
          this.clients = clients;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando clientes:', error);
          this.error = 'Error al cargar los clientes';
          this.loading = false;
        }
      });
  }

  private setupSearch() {
    this.term.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term =>
          term && term.trim() ? this.api.search(term.trim()) : of([])
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (results) => {
          this.results = results;
          this.showDropdown = results.length > 0;
        },
        error: (error) => {
          console.error('Error en búsqueda:', error);
          this.results = [];
          this.showDropdown = false;
        }
      });
  }

  // Método para seleccionar un resultado de búsqueda
  select(result: SearchItem) {
    this.showDropdown = false;
    this.term.setValue('');

    // Navegar según el tipo de resultado
    switch (result.type) {
      case 'client':
        this.router.navigate(['/clients', result.id]);
        break;
      case 'policy':
        this.router.navigate(['/policies', result.id]);
        break;
      case 'claim':
        this.router.navigate(['/claims', result.id]);
        break;
      default:
        console.warn('Tipo de resultado no reconocido:', result.type);
    }
  }

  // Método para obtener el avatar del usuario
  // dashboard.ts
  avatar(): string {
    if (this.user?.avatar_url) {
      return this.user.avatar_url;           // ←  avatar_url
    }
    // Avatar por defecto basado en iniciales
    return this.generateDefaultAvatar();
  }

  private generateDefaultAvatar(): string {
    const base = 'assets/images/default-avatar.png';
    const name = this.user?.full_name || this.user?.username;
    if (!name) return base;

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
    const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'>
      <rect width='40' height='40' fill='#3B82F6'/>
      <text x='20' y='25' font-size='14' font-weight='600'
            fill='white' text-anchor='middle'>${initials}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // Método para ir a nuevo cliente
  goNewClient() {
    this.router.navigate(['/clients/new']);
  }

  // Método para ir a reportes
  goReport() {
    this.router.navigate(['/reports']);
  }

  // Método para ir a recordatorios
  goReminders() {
    this.router.navigate(['/reminders']);
  }

  // Método para manejar el cierre del dropdown de búsqueda
  onSearchBlur() {
    // Pequeño delay para permitir que se procese el click en los resultados
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  // Método para manejar el focus en el input de búsqueda
  onSearchFocus() {
    if (this.results.length > 0) {
      this.showDropdown = true;
    }
  }

  // Método para refrescar los datos del dashboard
  refreshData() {
    this.loadDashboardData();
  }

  // Método para manejar errores de carga de imágenes
  onImageError(event: any) {
    event.target.src = 'assets/images/default-avatar.png';
  }
}
