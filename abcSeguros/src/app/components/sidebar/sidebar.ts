import { Component } from '@angular/core';
import {AuthService} from '../../services/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {            // o DashboardComponent
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/']);
  }
  isOpen=false;
  toggleSidebar(){ this.isOpen=!this.isOpen;
    document.querySelector('.sidebar')?.classList.toggle('show',this.isOpen);}

}
