import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';   // ←  añadido
import { AuthService } from '../../services/auth';

@Component({
  selector   : 'app-sidebar',
  standalone : true,
  imports    : [CommonModule, RouterModule],      // ←  añadido
  templateUrl: './sidebar.html',
  styleUrls  : ['./sidebar.css']
})
export class Sidebar {
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.clearSession();
  }
  isOpen=false;
  toggleSidebar(){ this.isOpen=!this.isOpen;
    document.querySelector('.sidebar')?.classList.toggle('show',this.isOpen);}


}





