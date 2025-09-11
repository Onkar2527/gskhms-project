import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { ServiceRate } from '../model/servicerate.model';

@Injectable({
  providedIn: 'root',
})

export class ServiceRateService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<ServiceRate[]> = new BehaviorSubject<ServiceRate[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: ServiceRate;
  hospitalId = 0;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    this.hospitalId = currentUser.hospitalId;
    this.apiBaseUrl = config.getApiUrl();
  }

  get data(): ServiceRate[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getServiceRates(userId: number): void {
    const data1 = new ServiceRate();
    data1.hospitalId = this.hospitalId;
    data1.employeeId = userId;
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'serviceRate/search', data1)
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

  getServiceRateForDoctor(userId: number, serviceId: number, hospitalId: number) {
    let serviceRate = new ServiceRate();
    serviceRate.hospitalId = hospitalId;
    serviceRate.employeeId = userId;
    serviceRate.serviceId = serviceId;
    return this.httpClient.post(this.apiBaseUrl + 'serviceRate/search/charge', serviceRate);
  }

  addServiceRate(req: ServiceRate) {
    req.hospitalId = this.hospitalId;
    return this.httpClient.post(this.apiBaseUrl + 'serviceRate/save', req);
  }
 
  updateServiceRate(req: ServiceRate) {
    req.hospitalId = this.hospitalId;
    return this.httpClient.post(this.apiBaseUrl + 'serviceRate/update', req);
  }
}
