import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { Bank } from '../model/bank.model';

@Injectable({
  providedIn: 'root',
})

export class BankService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Bank[]> = new BehaviorSubject<Bank[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Bank;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Bank[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getBankList(): void {
    const req = new Bank();
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'bank/search', req).subscribe({
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

  getBankByCriteria(bank: Bank) {
    return this.httpClient.post(this.apiBaseUrl + 'bank/search', bank);
  }
  addBank(bank: Bank): void {
    this.httpClient.post(this.apiBaseUrl + 'bank/save', bank)
      .subscribe({
        next: (data) => {
          this.dialogData = bank;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });

  }

  updateBank(bank: Bank): void {
    this.httpClient.put(this.apiBaseUrl + 'bank/update', bank)
      .subscribe({
        next: (data) => {
          this.dialogData = bank;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
      });
  }
}
