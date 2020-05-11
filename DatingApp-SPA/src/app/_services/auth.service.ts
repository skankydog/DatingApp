import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  // I think we should hold claims, Preferred name etc here and make
  // available for modules to use... having the whole decoded token seems
  // overkill.
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
        map((response: any) => {
          const details = response;

          if (details) {
            localStorage.setItem('token', details.token);
            localStorage.setItem('user', JSON.stringify(details.user));
            this.currentUser = details.user;
            this.changeMemberPhoto(this.currentUser.photoUrl);
            this.refresh();
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.decodedToken = null;
    this.currentUser = null;
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
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

    const user: User = JSON.parse(localStorage.getItem('user'));

    if (user) {
      this.currentUser = user;
      this.changeMemberPhoto(user.photoUrl);
    }
  }
}
