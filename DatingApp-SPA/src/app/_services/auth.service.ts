import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  // I think we should hold claims, Preferred name etc here and make
  // available for modules to use...

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
        map((response: any) => {
          const details = response;

          if (details) {
            localStorage.setItem('token', details.token);
            this.refresh();
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  refresh() {
    const token = localStorage.getItem('token');

    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }

}
