import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { Role } from '../model/role.model';

@Injectable({
  providedIn: 'root',
})

export class RoleService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Role;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Role[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getRoleLists(): void {
    const data1 = new Role();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'role/search', data1)
      .subscribe({
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
  addRole(req: Role):void {
    this.httpClient.post(this.apiBaseUrl + 'role/save', req)
        .subscribe({
          next: (data) => {
            this.dialogData = req;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updateRole(req: Role) :void{
    this.httpClient.put(this.apiBaseUrl + 'role/update', req)
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
