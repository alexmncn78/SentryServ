import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private logInUrl = environment.apiUrl + '/login';
  private logOutUrl = environment.apiUrl + '/logout';
  private authUrl = environment.apiUrl + '/auth';

  public username: string='';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.logInUrl, {username, password})
  }

  // Clear user data
  logout(): void {     
    this.clearToken();
    localStorage.clear();
  }

  // Request to backend logout
  logoutReq(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    return this.http.post<any>(this.logOutUrl, {}, { headers })
  }

  isAuthtenticated(): boolean {
    const token = this.getToken();
    if (token) {
      return true;
    }
    return false;
  }


  // JWTtoken cookie
  storeToken(token: string, expiresAt: string): void {
    const expireDate = new Date(expiresAt);
    this.cookieService.set('authToken', token, expireDate, '/', undefined, true, 'Strict');
  }

  getToken(): string | null {
    return this.cookieService.get('authToken');
  }

  clearToken(): void {
    this.cookieService.delete('authToken');
  }


  // User
  setUsername(username: string): void {
    localStorage.setItem('username', username);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
