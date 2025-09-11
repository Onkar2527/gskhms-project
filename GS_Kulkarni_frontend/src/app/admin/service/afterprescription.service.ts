import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';



@Injectable({
  providedIn: 'root',
})
export class AfterPrescriptionService extends UnsubscribeOnDestroyAdapter {
  
  apiBaseUrl: string = "";
  isTblLoading = true;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }

  saveAfterPrescription(data:any) {
    return this.httpClient.post(this.apiBaseUrl + 'prescriptionAfter/save', data);
  }

  getAfterPrescription(data:any) {
    return this.httpClient.post(this.apiBaseUrl + 'prescriptionAfter/search', data);
  }
}
