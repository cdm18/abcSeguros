import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://localhost:3000/api/auth';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User | null> {
    return this.http.post<User | null>(`${this.API_URL}/login`, { username, password }).pipe(
      tap(user => {
        if (user) {
          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      catchError(() => of(null))
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      this.currentUser = stored ? JSON.parse(stored) : null;
    }
    return this.currentUser;
  }
}
