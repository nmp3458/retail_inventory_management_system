import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthResponse {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpService: HttpService) {}

  login(credentials: {
    email: string;
    password: string;
    rememberMe: boolean;
  }): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>('auth/login', credentials);
  }

  currentUser(): Observable<AuthResponse> {
    return this.httpService.get<AuthResponse>('auth/me');
  }

  logout(): Observable<void> {
    return this.httpService.post<void>('auth/logout', {});
  }
}
