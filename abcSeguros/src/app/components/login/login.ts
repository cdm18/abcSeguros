import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth'; // Ajusta la ruta

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importando CommonModule y FormsModule para soporte de formularios
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onLogin(): void {
    if (this.authService.login(this.username, this.password)) {
      this.errorMessage = '';
      console.log('Login exitoso');
    } else {
      this.errorMessage = 'Credenciales incorrectas';
    }
  }
}
