import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { Designation } from 'app/admin/model/designation.model';

@Injectable({
  providedIn: 'root',
})

export class DesignationListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/departmentList.json';
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<Designation[]> = new BehaviorSubject<
    Designation[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: Designation;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Designation[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllDesignationLists(): void {
    const data1 = new Designation();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'designation/search', data1)
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
  addDesignation(designation: Designation):void {
    this.httpClient.post(this.apiBaseUrl + 'designation/save', designation)
        .subscribe({
          next: (data) => {
            this.dialogData = designation;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updateDesignation(designation: Designation) :void{
    this.httpClient.put(this.apiBaseUrl + 'designation/update', designation)
        .subscribe({
          next: (data) => {
            this.dialogData = designation;
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
