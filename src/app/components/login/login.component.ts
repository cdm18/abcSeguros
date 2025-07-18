import { Component } from '@angular/core';
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
export class LoginComponent {
  username = '';
  password = '';
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    this.auth.login(this.username, this.password).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMsg = 'Credenciales incorrectas';
        }
      },
      error: err => {
        console.error('Login error', err);
        this.errorMsg = 'Error de servidor';
      }
    });
  }
}
