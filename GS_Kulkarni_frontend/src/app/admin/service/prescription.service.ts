import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';



@Injectable({
  providedIn: 'root',
})
export class PrescriptionService extends UnsubscribeOnDestroyAdapter {
  
  apiBaseUrl: string = "";
  isTblLoading = true;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }

  savePrescription(data:any) {
    return this.httpClient.post(this.apiBaseUrl + 'prescription/save', data);
  }

  getPrescription(data:any) {
    return this.httpClient.post(this.apiBaseUrl + 'prescription/search', data);
  }
}
