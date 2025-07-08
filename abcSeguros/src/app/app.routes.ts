import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AuthService } from './services/auth';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [() => {
      const auth   = inject(AuthService);
      const router = inject(Router);
      if (auth.isAuth()) { router.navigate(['/dashboard']); return false; }
      return true;
    }]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [() => {
      const auth   = inject(AuthService);
      const router = inject(Router);
      if (!auth.isAuth()) { router.navigate(['/']); return false; }
      return true;
    }]
  },
  { path: '**', redirectTo: '' }
];
