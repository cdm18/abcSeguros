import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user'; // Importar desde models/user.ts

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    // Cargar usuario desde localStorage si existe
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.userSubject.next(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }

  setSession(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearSession() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  get user(): User | null {
    return this.userSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.user !== null;
  }
}
