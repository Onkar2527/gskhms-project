import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { RateTye } from '../model/rateType.model';

@Injectable({
  providedIn: 'root',
})

export class RateTypeService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<RateTye[]> = new BehaviorSubject<RateTye[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: RateTye;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): RateTye[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getPatientCategoryLists(): void {
    const data1 = new RateTye();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'rateType/search', data1)
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
  addPatientCategory(req: RateTye):void {
    this.httpClient.post(this.apiBaseUrl + 'rateType/save', req)
        .subscribe({
          next: (data) => {
            this.dialogData = req;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updatePatientCategory(req: RateTye) :void{
    this.httpClient.put(this.apiBaseUrl + 'rateType/update', req)
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
