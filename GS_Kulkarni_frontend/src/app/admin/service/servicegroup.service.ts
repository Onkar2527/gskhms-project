import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { ServiceGroup } from '../model/servicegroup.model';

@Injectable({
  providedIn: 'root',
})

export class ServiceGroupService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<ServiceGroup[]> = new BehaviorSubject<ServiceGroup[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: ServiceGroup;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): ServiceGroup[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getServiceGruoups(): void {
    const data1 = new ServiceGroup();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'servicegroup/search', data1)
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
  addServiceGruoup(req: ServiceGroup):void {
    this.httpClient.post(this.apiBaseUrl + 'servicegroup/save', req)
        .subscribe({
          next: (data) => {
            this.dialogData = req;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updateServiceGruoup(req: ServiceGroup) :void{
    this.httpClient.put(this.apiBaseUrl + 'servicegroup/update', req)
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
