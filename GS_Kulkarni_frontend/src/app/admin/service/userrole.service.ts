import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';
import { UserRole } from '../model/userrole.model';

@Injectable({
  providedIn: 'root',
})

export class UserRoleService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<UserRole[]> = new BehaviorSubject<UserRole[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: UserRole;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): UserRole[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getUserRoleList(): void {
    const req = new UserRole();
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'userRole/search', req).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  addUserRole(req: UserRole): void {
    this.httpClient.post(this.apiBaseUrl + 'userRole/save', req)
      .subscribe({
        next: (data) => {
          this.dialogData = req;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });

  }

  updateUserRole(req: UserRole): void {
    this.httpClient.put(this.apiBaseUrl + 'userRole/update', req)
      .subscribe({
        next: (data) => {
          this.dialogData = req;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });
  }
}
