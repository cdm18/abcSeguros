import { Injectable }           from '@angular/core';
import { HttpClient }           from '@angular/common/http';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';
import { User }                 from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API_URL = 'http://localhost:3000/api/auth';

  /** Estado interno (observable + getter sincrónico) */
  private readonly _currentUser$ = new BehaviorSubject<User | null>(this.readUser());
  currentUser$                   = this._currentUser$.asObservable();

  constructor(private http: HttpClient) {}

  /* ----------  AUTH  ---------- */
  login(username: string, password: string) {
    return this.http
      .post<User>(`${this.API_URL}/login`, { username, password })
      .pipe(
        tap(user => {
          if (!user) return;
          this._currentUser$.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }),
        catchError(() => of(null))
      );
  }

  logout(): void {
    this._currentUser$.next(null);
    localStorage.removeItem('currentUser');
  }

  /* ----------  HELPERS  ---------- */
  isAuthenticated(): boolean { return !!this._currentUser$.value; }
  get currentUser(): User | null { return this._currentUser$.value; }

  private readUser(): User | null {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) as User : null;
  }
}
