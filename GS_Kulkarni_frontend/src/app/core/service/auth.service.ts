import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user';
import { ConfigService } from '../../config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  apiBaseUrl: string = "";

  constructor(private http: HttpClient, private config: ConfigService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.apiBaseUrl = config.getApiUrl();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // login(username: string, password: string) {
  //   return this.http.get(this.apiBaseUrl + '/login?email=' + username + '&password=' + password);
  // }

  login(username: string, password: string) {
    return this.http.get(this.apiBaseUrl + 'user/validateUser?email=' + username + '&password=' + password);
  }

  // login(username: string, password: string) {
  //   return this.http.get(this.apiBaseUrl + '/login?email=' + username + '&password=' + password);
  // }

  ok(body?: {
    id: number;
    img: string;
    username: string; 
    firstName: string;
    lastName: string;
    token: string;
  }) {
    return of(new HttpResponse({ status: 200, body }));
  }

  error(message: string) {
    return throwError(message);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}
