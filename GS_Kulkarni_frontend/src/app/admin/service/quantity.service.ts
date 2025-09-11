import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';
import { Quantity } from '../model/quantity.model';

@Injectable({
  providedIn: 'root',
})

export class QuantityService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Quantity[]> = new BehaviorSubject<Quantity[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Quantity;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Quantity[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getQuantityList(): void {
    const req = new Quantity();
    this.subs.sink = this.httpClient.get<any>(this.apiBaseUrl + 'quantity/search').subscribe({
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

  getQuantityById(id: number) {
    return this.httpClient.get(this.apiBaseUrl + 'quantity/search/' + id);
  }
  getQuantityByCriteria(quantity: Quantity) {
    return this.httpClient.post(this.apiBaseUrl + 'quantity/search', quantity);
  }

  addQuantity(quantity: Quantity) {
    return this.httpClient.post(this.apiBaseUrl + 'quantity/save', quantity);
  }

  updateQuantity(quantity: Quantity) {
    return this.httpClient.put(this.apiBaseUrl + 'quantity/update', quantity);
  }

}
