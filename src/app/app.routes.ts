import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clients/clientes.component';
import { PlanesComponent } from './components/plans/planes.component';
import { CotizacionesComponent } from './components/quotations/cotizaciones.component';
import { PolizasComponent } from './components/policies/polizas.component';
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
