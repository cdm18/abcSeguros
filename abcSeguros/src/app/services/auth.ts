import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User { id: number; username: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(null);
  readonly user$ = this._user$.asObservable();

  constructor() {
    const raw = localStorage.getItem('user');
    if (raw) this._user$.next(JSON.parse(raw));
  }

  isAuth(): boolean { return !!this._user$.value; }

  setSession(user: User) {
    this._user$.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearSession() {
    this._user$.next(null);
    localStorage.removeItem('user');
  }

  get user() { return this._user$.value; }
}
