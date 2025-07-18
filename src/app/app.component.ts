import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, CommonModule]
})
export class AppComponent {
  title = 'abcSeguros';
  constructor(private router: Router) {}

  esRutaLogin(): boolean {
    return this.router.url === '/login';
  }
}
