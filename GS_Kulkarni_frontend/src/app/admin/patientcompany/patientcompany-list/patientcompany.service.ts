import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { PatientCompany } from 'app/admin/model/patientcompany.model';

@Injectable({
  providedIn: 'root',
})

export class PatientCompanyService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<PatientCompany[]> = new BehaviorSubject<
  PatientCompany[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: PatientCompany;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): PatientCompany[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getPatientCompanyLists(): void {
    const data1 = new PatientCompany();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'patCompany/search', data1)
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
  addPatientCompany(req: PatientCompany):void {
    this.httpClient.post(this.apiBaseUrl + 'patCompany/save', req)
        .subscribe({
          next: (data) => {
            this.dialogData = req;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updatePatientCompany(req: PatientCompany) :void{
    this.httpClient.put(this.apiBaseUrl + 'patCompany/update', req)
        .subscribe({
          next: (data) => {
            this.dialogData = req;
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
