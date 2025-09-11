import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { SubDepartmet } from 'app/admin/model/subdepartments.model';

@Injectable({
  providedIn: 'root',
})

export class SubDepartmentListService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<SubDepartmet[]> = new BehaviorSubject<
  SubDepartmet[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: SubDepartmet;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): SubDepartmet[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllsubdepartmentLists(): void {
    const data1 = new SubDepartmet();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'dept/subdept/search', data1)
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
  addSubdepartment(subdepartment: SubDepartmet):void {
    this.httpClient.post(this.apiBaseUrl + 'dept/subdept/save', subdepartment)
        .subscribe({
          next: (data) => {
            this.dialogData = subdepartment;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updateSubDepartment(subdepartment: SubDepartmet) :void{
    this.httpClient.put(this.apiBaseUrl + 'dept/subdept/update', subdepartment)
        .subscribe({
          next: (data) => {
            this.dialogData = subdepartment;
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
