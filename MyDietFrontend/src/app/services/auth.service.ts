import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService) { }

  login(credentials: any) {
    return this.http.post('http://localhost:5287/api/User/login', credentials)
      .pipe(map((response: any) => {
        if (response && response.tokenString) {
          localStorage.setItem('access_token', response.tokenString);

          const decodedToken = this.jwtHelper.decodeToken(response.tokenString);
          localStorage.setItem('username', decodedToken.unique_name);
          localStorage.setItem('role', decodedToken.role);

          return true;
        }
        return false;
      }));
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  signup(credentials: any) {
    return this.http.post('http://localhost:5287/api/User/register', credentials);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }
}
