import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { User } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMsg = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Limpiar mensajes de error al inicializar
    this.errorMsg = '';
  }

  login(): void {
    if (!this.username || !this.password) {
      this.errorMsg = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    this.auth.login(this.username, this.password).subscribe({
      next: (user: User | null) => {
        this.isLoading = false;
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMsg = 'Credenciales incorrectas. Verifica tu usuario y contraseña.';
        }
      },
      error: err => {
        this.isLoading = false;
        console.error('Login error', err);
        this.errorMsg = 'Error de conexión. Intenta nuevamente.';
      }
    });
  }

  // Limpiar mensaje de error cuando el usuario empiece a escribir
  clearError(): void {
    if (this.errorMsg) {
      this.errorMsg = '';
    }
  }
}
