import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { Occupation } from 'app/admin/model/occupation.model';

@Injectable({
  providedIn: 'root',
})

export class OccupationListService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/departmentList.json';
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<Occupation[]> = new BehaviorSubject<
  Occupation[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: Occupation;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Occupation[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllOccupationLists(): void {
    const data1 = new Occupation();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'occupation/search', data1)
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
  addOccupation(occupation: Occupation):void {
    this.httpClient.post(this.apiBaseUrl + 'occupation/save', occupation)
        .subscribe({
          next: (data) => {
            this.dialogData = occupation;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updateOccupation(occupation: Occupation) :void{
    this.httpClient.put(this.apiBaseUrl + 'occupation/update', occupation)
        .subscribe({
          next: (data) => {
            this.dialogData = occupation;
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
