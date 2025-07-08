import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Sidebar } from '../sidebar/sidebar';
import { ApiService, Summary, Client } from '../../services/api';
import AOS from 'aos';

@Component({
  selector:'app-dashboard',
  standalone:true,
  imports:[CommonModule,NgFor,NgClass,NgIf,Sidebar],
  templateUrl:'./dashboard.html',
  styleUrls:['./dashboard.css']
})
export class DashboardComponent implements OnInit{
  summary?:Summary;
  clients:Client[]=[];
  loading=true;

  constructor(private api:ApiService){}
  ngOnInit(){
    AOS.init({duration:700, once:true});
    this.api.getSummary().subscribe(s=>this.summary=s);
    this.api.getRecentClients().subscribe({
      next: c => { this.clients = c; this.loading = false; },
      error: err => {
        console.error('⚠️ getRecentClients', err);
        this.loading = false;
      }
    });
  }
}
