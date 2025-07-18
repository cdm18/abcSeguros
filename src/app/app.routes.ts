import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clients/clientes.component';
import { PlanesComponent } from './components/plans/planes.component';
import { CotizacionesComponent } from './components/quotations/cotizaciones.component';
import { PolizasComponent } from './components/policies/polizas.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  // redir en caso de ruta invalida
  { path: '**', redirectTo: 'dashboard' },

  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [AuthGuard]
  },
  {
    path: 'clientes',
    component: ClientesComponent,
    title: 'Clientes',
    canActivate: [AuthGuard]
  },
  {
    path: 'planes',
    component: PlanesComponent,
    title: 'Planes',
    canActivate: [AuthGuard]
  },
  {
    path: 'cotizaciones',
    component: CotizacionesComponent,
    title: 'Cotizaciones',
    canActivate: [AuthGuard]
  },
  {
    path: 'polizas',
    component: PolizasComponent,
    title: 'Pólizas',
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },


];
