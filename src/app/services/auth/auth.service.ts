import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';

import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  public isLoggedIn: boolean = false;
  public user: User;
  public token: string;

  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient, private router: Router) {

  }

  public login(email: string, password: string) {
    const url = `${this.serverUrl}` + '/auth/login';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, { 'email': email, 'password': password }, httpOptions)
      .pipe(
        tap((res: User) => {
          this.token = res.token;
          if (this.token.length) {
            this.isLoggedIn = true;
            this.user = res;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
          } else {
            this.isLoggedIn = false;
            localStorage.setItem('token', '');
          }
          return this.token;
        })
      );
  }

  public logout() {
    this.isLoggedIn = false;
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.router.navigate(['/login']);
  }

  public getUser() {
    let user = localStorage.getItem('user');
    if (user && user != '') return this.user = JSON.parse(user);
    else return null;
  }

  public updatePassword(old_password, new_password, email) {
    const url = `${this.serverUrl}` + '/auth/updatePassword';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };

    return this.http.post(url, { old_password, new_password, email }, httpOptions)
      .pipe(
        tap((res: any) => {
          return res
        })
      );
  }

}
