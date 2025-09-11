import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { PatientsCategory } from 'app/admin/model/patientscategory.model';

@Injectable({
  providedIn: 'root',
})

export class PatientsCategoryService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<PatientsCategory[]> = new BehaviorSubject<
  PatientsCategory[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: PatientsCategory;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): PatientsCategory[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getPatientCategoryLists(): void {
    const data1 = new PatientsCategory();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'patCategory/search', data1)
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
  addPatientCategory(req: PatientsCategory):void {
    this.httpClient.post(this.apiBaseUrl + 'patCategory/save', req)
        .subscribe({
          next: (data) => {
            this.dialogData = req;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updatePatientCategory(req: PatientsCategory) :void{
    this.httpClient.put(this.apiBaseUrl + 'patCategory/update', req)
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
