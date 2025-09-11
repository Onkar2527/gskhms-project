import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DepartmentList } from './department-list.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';

@Injectable({
  providedIn: 'root',
})

export class DepartmentListService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<DepartmentList[]> = new BehaviorSubject<
    DepartmentList[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: DepartmentList;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): DepartmentList[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllDepartmentLists(): void {
    const data1 = new DepartmentList();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'dept/search', data1)
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
  addDepartmentList(departmentList: DepartmentList):void {
    this.dialogData = departmentList;
    this.httpClient.post(this.apiBaseUrl + 'dept/save', departmentList)
        .subscribe({
          next: (data) => {
            this.dialogData = departmentList;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updateDepartmentList(departmentList: DepartmentList) :void{
    this.dialogData = departmentList;
    this.httpClient.put(this.apiBaseUrl + 'dept/update', departmentList)
        .subscribe({
          next: (data) => {
            this.dialogData = departmentList;
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
          },
        });
  }
  deleteDepartmentList(id: number): void {
    console.log(id);

    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         console.log(id);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
}
