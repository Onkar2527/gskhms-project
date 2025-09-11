import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';
import { Pharmacy } from '../model/pharmacy.model';

@Injectable({
  providedIn: 'root',
})

export class PharmacyService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Pharmacy[]> = new BehaviorSubject<Pharmacy[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Pharmacy;
  apiBaseUrl: string = "";
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
  getPharmacyList(): void {
    const req = new Pharmacy();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.get<any>(this.apiBaseUrl + 'pharmacy/search').subscribe({
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

  getPharmacyById(id: number) {
    return this.httpClient.get(this.apiBaseUrl + 'pharmacy/search/' + id);
  }
  getPharmacyByCriteria(pharmacy: Pharmacy) {
    return this.httpClient.post(this.apiBaseUrl + 'pharmacy/search', pharmacy);
  }

  addPharmacy(pharmacy: Pharmacy) {
    return this.httpClient.post(this.apiBaseUrl + 'pharmacy/save', pharmacy);
  }

  updatePharmacy(pharmacy: Pharmacy) {
    return this.httpClient.put(this.apiBaseUrl + 'pharmacy/update', pharmacy);
  }

}
