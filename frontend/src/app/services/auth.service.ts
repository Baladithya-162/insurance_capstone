import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  authUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {
    this.restoreSession();
  }

  private restoreSession() {
    if (this.checkLogin()) {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any = this.jwtHelper.decodeToken(token);
        const user: User = {
          _id: decodedToken.userId,  // ✅ correct key from backend
          name: '',                  // backend token has no name/email
          email: '',
          role: decodedToken.role,
        };
        this.userSubject.next(user);
      }
    }
  }

  checkLogin(): boolean {
    const token = localStorage.getItem('token');
    const loggedIn = !!token && !this.jwtHelper.isTokenExpired(token);

    if (!loggedIn) {
      this.userSubject.next(null);
      localStorage.removeItem('token');
    }

    return loggedIn;
  }

  register(name: string, email: string, password: string) {
    return this.http.post<User>(`${this.authUrl}/register`, {
      name,
      email,
      password
      // role excluded, backend defaults to "customer"
    });
  }

  login(email: string, password: string) {
    return this.http
      .post<{ token: string; user: User }>(`${this.authUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.userSubject.next(response.user);
          localStorage.setItem('token', response.token);
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }

  logout() {
    this.userSubject.next(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Expose current userId from JWT for APIs that require it explicitly
  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded: any = this.jwtHelper.decodeToken(token);
      return decoded?.userId || decoded?._id || null;
    } catch {
      return null;
    }
  }
}
