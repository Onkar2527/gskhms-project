import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { Services } from '../model/services.model';

@Injectable({
  providedIn: 'root',
})

export class ServicesService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<Services[]> = new BehaviorSubject<Services[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Services;
  hospitalId = 0;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    this.hospitalId = currentUser.hospitalId;
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Services[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getServices(): void {
    const data1 = new Services();
    data1.hospitalId = this.hospitalId;
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'services/search', data1)
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

  addServices(req: Services):void {
    req.hospitalId = this.hospitalId;
    this.httpClient.post(this.apiBaseUrl + 'services/save', req)
        .subscribe({
          next: (data) => {
            this.dialogData = req;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }

  updateServices(req: Services) :void{
    req.hospitalId = this.hospitalId;
    this.httpClient.put(this.apiBaseUrl + 'services/update', req)
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
