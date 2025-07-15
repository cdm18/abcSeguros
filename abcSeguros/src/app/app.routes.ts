import { Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard';
import { ProfileComponent   } from './components/profile/profile';
import { LoginComponent     } from './components/login/login';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },

  /* secciones protegidas */
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile',   component: ProfileComponent,   canActivate: [authGuard] },

  /* login sin guard */
  { path: 'login',     component: LoginComponent },

  /* comodín */
  { path: '**', redirectTo: 'dashboard' }
];
