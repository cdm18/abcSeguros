// app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { DashboardComponent }     from './components/dashboard/dashboard.component';
import { ClientesComponent }      from './components/clients/clientes.component';
import { PlanesComponent }        from './components/plans/planes.component';
import { CotizacionesComponent }  from './components/quotations/cotizaciones.component';
import { PolizasComponent }       from './components/policies/polizas.component';
import { LoginComponent }         from './components/login/login.component';

export const routes: Routes = [

  /* === ÁREA PRIVADA === */
  { path: 'dashboard'         , component: DashboardComponent   , canActivate:[AuthGuard], title:'Dashboard'      },
  { path: 'clientes'          , component: ClientesComponent    , canActivate:[AuthGuard], title:'Clientes'       },
  { path: 'planes'            , component: PlanesComponent      , canActivate:[AuthGuard], title:'Planes'         },

  /* Cotizaciones */
      { path:'cotizaciones'           , component:CotizacionesComponent, canActivate:[AuthGuard], title:'Cotizaciones' },
      { path:'cotizaciones/nueva'     , component:CotizacionesComponent, canActivate:[AuthGuard], title:'Nueva cotización' },
      { path:'cotizaciones/editar/:id', component:CotizacionesComponent, canActivate:[AuthGuard], title:'Editar cotización' },

  { path: 'polizas'           , component: PolizasComponent     , canActivate:[AuthGuard], title:'Pólizas'        },

  /* Login (pública) */
  { path: 'login', component: LoginComponent, title:'Iniciar sesión' },

  /* Catch-all */
  { path: '**', redirectTo: 'dashboard' }
];
