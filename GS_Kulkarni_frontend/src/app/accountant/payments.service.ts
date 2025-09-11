import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

import { ConfigService } from '@config';
import { Payment } from 'app/accountant/todays-payments/Payment.model';

@Injectable({
  providedIn: 'root',
})

export class PaymentsService extends UnsubscribeOnDestroyAdapter {

  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<Payment[]> = new BehaviorSubject<Payment[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Payment;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }

  get data(): Payment[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }
  
  getTodaysPayments(paymentStartDate: any, paymentEndDate: any): void {
    let data1 = new Payment();
    data1.paymentStartDate = paymentStartDate;
    data1.paymentEndDate = paymentEndDate;
  
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;

    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'payment/search', data1)
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

   makeIPDPayment(payment: any) {
    return this.httpClient.post(this.apiBaseUrl + 'payment/save-ipd', payment);
  }

  makePayment(payment: any) {
    return this.httpClient.post(this.apiBaseUrl + 'payment/save', payment);
  }

  getPayments(payment: any) {
    return this.httpClient.post(this.apiBaseUrl + 'payment/search', payment);
  }
}
