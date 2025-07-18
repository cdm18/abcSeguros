/* ========================================================================
   dashboard.component.ts
   ======================================================================== */
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import {CommonModule, NgIf, NgForOf, SlicePipe, NgOptimizedImage} from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType
} from 'chart.js/auto';

import { AuthService }                       from '../../services/auth.service';
import { DashboardService, DashboardStats }  from '../../services/dashboard.service';
import { AnimateOnScrollDirective }          from '../../directives/animate-on-scroll.directive';
import {RouterLink} from "@angular/router";

@Component({
  selector   : 'app-dashboard',
  standalone : true,
  imports: [
    CommonModule, NgIf, NgForOf, SlicePipe,
    NgChartsModule,
    AnimateOnScrollDirective, RouterLink, NgOptimizedImage
  ],
  templateUrl: './dashboard.component.html',
  styleUrls  : ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /* ───────── DI ───────── */
  private dash = inject(DashboardService);
  public  auth = inject(AuthService);

  /* ───────── Signals ───────── */
  private _loading = signal(true);
  private _stats   = signal<DashboardStats | null>(null);

  readonly loading = computed(() => this._loading());
  readonly stats   = computed(() => this._stats());

  /* ───────── Helpers ───────── */
  get totalClients()      { return this.stats()?.totalClients      ?? 0; }
  get totalQuotations()   { return this.stats()?.totalQuotations   ?? 0; }
  get onTimePayments()    { return this.stats()?.onTimePayments    ?? 0; }
  get pendingPayments()   { return this.stats()?.pendingPayments   ?? 0; }
  get lastClients()       { return this.stats()?.lastClients       ?? []; }

  /* =========================================================================
     CHART A · Doughnut (Estado de pagos)
     ========================================================================= */
  readonly doughnutCfg = computed<ChartConfiguration>(() => ({
    type : 'doughnut',
    data : {
      labels  : ['Pagos a tiempo', 'Pagos pendientes'],
      datasets: [{
        data           : [ this.onTimePayments, this.pendingPayments ],
        backgroundColor: ['#34d399', '#fb923c'],
        borderWidth    : 0,
        hoverOffset    : 6
      }]
    },
    options: {
      responsive: true,
      cutout   : '65%',
      plugins  : { legend:{ position:'bottom' } }
    }
  }));

  /* =========================================================================
     CHART B · Línea (Clientes & Cotizaciones últimos 6 meses)
     ========================================================================= */
  readonly trendCfg = computed<ChartConfiguration>(() => {

    /* --- genera últimos 6 meses --- */
    const labels: string[] = [];
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const now = new Date();
    for(let i=5;i>=0;i--){
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      labels.push(`${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`);
    }

    /* --- mock rápido usando stats (→ ~distribución) --- */
    const randomize = (base:number) =>
      Array.from({length:6},()=>Math.max(1,Math.round(base*(.6+Math.random()*0.8))));
    const cotData  = randomize(this.totalQuotations/6||1);
    const cliData  = randomize(this.totalClients/6   ||1);

    const data: ChartData<'line'> = {
      labels,
      datasets: [
        {
          label           : 'Cotizaciones',
          data            : cotData,
          tension         : .35,
          pointRadius     : 3,
          borderWidth     : 2,
          fill            : false
        },
        {
          label           : 'Clientes',
          data            : cliData,
          tension         : .35,
          pointRadius     : 3,
          borderWidth     : 2,
          borderDash      : [6,3],
          fill            : false
        }
      ]
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      plugins   : { legend:{ display:false } },
      scales    : {
        x: { grid:{ display:false } },
        y: { beginAtZero:true, ticks:{ stepSize:1 }, grid:{ color:'#f1f5f9' } }
      }
    };

    return { type:'line' as ChartType, data, options };
  });

  /* ───────── Lifecycle ───────── */
  ngOnInit(): void {
    this.dash.getStats().subscribe({
      next     : s => this._stats.set(s),
      error    : () => console.error('Error dashboard'),
      complete : () => this._loading.set(false)
    });
  }
}

