import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { PlanesComponent } from './components/planes/planes.component';
import { CotizacionesComponent } from './components/cotizaciones/cotizaciones.component';
import { PolizasComponent } from './components/polizas/polizas.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'clientes', component: ClientesComponent, title: 'Clientes' },
  { path: 'planes', component: PlanesComponent, title: 'Planes' },
  { path: 'cotizaciones', component: CotizacionesComponent, title: 'Cotizaciones' },
  { path: 'polizas', component: PolizasComponent, title: 'Pólizas' },
  { path: '**', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },


];
