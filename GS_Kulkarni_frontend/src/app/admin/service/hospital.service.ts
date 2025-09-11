import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';
import { Hospital } from '../model/hospital.model';

@Injectable({
  providedIn: 'root',
})

export class HospitalService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Hospital[]> = new BehaviorSubject<Hospital[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Hospital;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Hospital[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getHospitalList(): void {
    const req = new Hospital();
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'hospital/search', req).subscribe({
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

  getHospitalByCriteria(hospital: Hospital) {
    return this.httpClient.post(this.apiBaseUrl + 'hospital/search', hospital);
  }

  addHospital(hospital: Hospital) {
    return this.httpClient.post(this.apiBaseUrl + 'hospital/save', hospital);
  }

  updateHospital(hospital: Hospital) {
    return this.httpClient.put(this.apiBaseUrl + 'hospital/update', hospital);
  }

}
