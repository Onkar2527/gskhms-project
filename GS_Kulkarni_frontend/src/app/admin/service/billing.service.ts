import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';
import { Billing } from '../../../app/admin/model/billing.model'

@Injectable({
  providedIn: 'root',
})

export class BillingService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Billing[]> = new BehaviorSubject<Billing[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Billing;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Billing[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getBill(): void {
    const req = new Billing();
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'bill/{billingId}', req).subscribe({
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

  addBilling(billing: Billing) {
    return this.httpClient.post(this.apiBaseUrl + 'bill/save', billing);
  }

  getTodaysBills(): void {
    this.subs.sink = this.httpClient
      .get<any>(this.apiBaseUrl + 'bill/today')
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

  getBills(startDate: Date, endDate: Date): void {
    let data1 = new Billing();
    data1.billingStartDate = startDate;
    data1.billingEndDate = endDate;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;

    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'bill/search', data1)
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data.data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
        },
      });
  }

  getPastBillings(): void {
    this.subs.sink = this.httpClient
      .get<any>(this.apiBaseUrl + 'bill/past')
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

}
