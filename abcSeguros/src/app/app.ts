import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login';  // Ajusta la ruta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],  // Solo importa el componente de Login
  template: `<app-login></app-login>`,  // Usamos el selector para mostrar el componente
})
export class App {}
