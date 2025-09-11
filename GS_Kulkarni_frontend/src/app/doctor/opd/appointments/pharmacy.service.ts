import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { Pharmacy } from './pharmacy.model';


@Injectable({
  providedIn: 'root',
})

export class PharmacyService extends UnsubscribeOnDestroyAdapter {
  
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<Pharmacy[]> = new BehaviorSubject<
    Pharmacy[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: Pharmacy;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  
  get data(): Pharmacy[] {
    return this.dataChange.value;
  }
  
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllPharmacys(): void {
    const data1 = {
      hospitalId:1
    }
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'pharmacy/search', data1)
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
