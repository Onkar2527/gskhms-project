import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { UserDepartments } from '../model/userdepartment.model';

@Injectable({
  providedIn: 'root',
})

export class UserDepartmentService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<UserDepartments[]> = new BehaviorSubject<UserDepartments[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: UserDepartments;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): UserDepartments[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getUserDeptList(): void {
    const req = new UserDepartments();
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'userDept/search', req).subscribe({
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

  addUserDept(req: UserDepartments): void {
    this.httpClient.post(this.apiBaseUrl + 'userDept/save', req)
      .subscribe({
        next: (data) => {
          this.dialogData = req;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });

  }

  updateUserDept(req: UserDepartments): void {
    this.httpClient.put(this.apiBaseUrl + 'userDept/update', req)
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
