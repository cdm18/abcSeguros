// login.ts
import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule }        from '@angular/forms';   // ← camino correcto
import { Router }             from '@angular/router';
import { ApiService }         from '../../services/api';
import { AuthService }        from '../../services/auth';

@Component({
  selector   : 'app-login',
  standalone : true,
  imports    : [CommonModule, FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls  : ['./login.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private api : ApiService,
    private auth: AuthService,
    private router: Router
  ) {
    if (this.auth.isAuth()) this.router.navigate(['/dashboard']);
  }

  onLogin() {
    this.api.login(this.username, this.password).subscribe({
      next: (res: any) => {              // ← tipa como any o define interfaz
        this.auth.setSession(res.user);  // res.user ahora es válido
        this.router.navigate(['/dashboard']);
      },
      error: () => this.errorMessage = 'Credenciales incorrectas'
    });
  }
}
