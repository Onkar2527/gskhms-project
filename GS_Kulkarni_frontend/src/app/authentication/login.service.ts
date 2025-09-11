
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedInUser = new BehaviorSubject<any>("");
  currentLoggedInUser = this.loggedInUser.asObservable();
  public userPermissions: any = [];
  public selectedUserRole: any = {};
  constructor() {
    let user={
      "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0ZG9jdG9yQGhvc3BpdGFsLm9yZyIsImlhdCI6MTcxOTE2NDQ3NCwiZXhwIjoxNzE5MjA3Njc0fQ.X131QF20weAXtxTRe_0lSzOUwJv7ca96rLFD1MG4p1E",
      "expiresIn": 1719207674960,
      "img": "assets/images/user/admin.jpg",
      "username": "testdoctor@hospital.org",
      "firstName": "test",
      "lastName": "admin",
      "hospitalId": 1,
      "role": "Doctor"
    }
    this.loggedInUser.next(user);
  }

  logCurrentUserData(data: any) {
    
    this.loggedInUser.next(data);
  }

  
}