import {
  Component, HostListener, OnDestroy, OnInit,
  inject, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector   : 'app-navbar',
  standalone : true,
  imports    : [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl   : './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  /* ───────── DI ───────── */
  private readonly router = inject(Router);
  private readonly auth   = inject(AuthService);

  /* ───────── Signals ───────── */
  private readonly _collapsed     = signal<boolean>(true);
  private readonly _userMenuOpen  = signal<boolean>(false);
  private readonly _currentRoute  = signal<string>('');
  private readonly _user          = signal<User | null>(null);

  /**  Computeds — expuestos al template  */
  readonly isCollapsed  = computed(() => this._collapsed());
  readonly showUserMenu = computed(() => this._userMenuOpen());
  readonly user         = computed(() => this._user());

  /**  Versiones “helper” para evitar lógica en plantilla */
  readonly displayName  = computed(
    () => this._user()?.full_name || this._user()?.username || 'Usuario'
  );
  readonly displayPhone = computed(
    () => this._user()?.phone || 'Sin teléfono'
  );
  readonly displayAvatar = computed(
    () => this._user()?.avatar_url || 'assets/avatars/default.jpg'
  );

  /* ───────── Subs ───────── */
  private routerSub?: Subscription;
  private userSub?:   Subscription;

  /* ───────── CONST ───────── */
  private readonly MOBILE_BREAKPOINT = 768;

  private syncBodyClass(): void {
    const body = document.body;
    body.classList.toggle('sidebar-expanded', !this._collapsed());
    body.classList.toggle('sidebar-collapsed',  this._collapsed());
  }


  /* ───────── Lifecycle ───────── */
  ngOnInit(): void {
    /* user */
    this.userSub = this.auth.currentUser$.subscribe({
      next : u => this._user.set(u),
      error: e => console.error('Auth stream error', e)
    });

    /* router */
    this.routerSub = this.router.events.pipe(
      filter(ev => ev instanceof NavigationEnd)
    ).subscribe({
      next : ev => {
        const nav = ev as NavigationEnd;
        this._currentRoute.set(nav.urlAfterRedirects);
        this.closeSidebarOnMobile();
      }
    });

    /* estado inicial */
    this._collapsed.set(this.isMobile());
    this.syncBodyClass();              //  <——  arreglo
    this._currentRoute.set(this.router.url);
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.userSub  ?.unsubscribe();
  }

  /* ───────── Host listeners ───────── */
  @HostListener('window:resize')
  handleResize(): void {
    if (this.isMobile()) {
      this._collapsed.set(true);
      this._userMenuOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(ev: Event): void {
    const target = ev.target as HTMLElement;
    if (!target.closest('.user-profile') && !target.closest('.user-menu')) {
      this._userMenuOpen.set(false);
    }
  }

  /* ───────── UI helpers ───────── */
  private isMobile(): boolean {
    return window.innerWidth < this.MOBILE_BREAKPOINT;
  }
  private closeSidebarOnMobile(): void {
    if (this.isMobile()) {
      this._collapsed.set(true);
      this._userMenuOpen.set(false);
    }
  }

  /* ───────── Public API (template) ───────── */
  toggleSidebar(): void {
    this._collapsed.update(v => !v);
    if (this._collapsed()) this._userMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    if (!this._collapsed()) this._userMenuOpen.update(v => !v);
  }

  navigateTo(url: string): void {
    this.router.navigate([url]).then(() => this.closeSidebarOnMobile());
  }

  isActive(path: string): boolean {
    const route = this._currentRoute();
    return route === path || route.startsWith(path + '/');
  }

  onNavClick(): void { this.closeSidebarOnMobile(); }

  logOut(ev: Event): void {
    ev.preventDefault();
    this.auth.logout();
    this._userMenuOpen.set(false);
    this.router.navigate(['/login']).catch(console.error);
  }
}
