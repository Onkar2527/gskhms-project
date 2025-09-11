import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Registration } from '../model/registration.model';
import { ConfigService } from 'app/admin/employees/allemployees/config.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/appointment.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Registration[]> = new BehaviorSubject<
  Registration[]
  >([]);
  // Temporarily stores data from dialogs
  dialogData!: Registration;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Registration[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllRegistration(registration:any): void {
    this.subs.sink  = this.httpClient.post<any>(this.apiBaseUrl + 'labregistration/search',registration).subscribe({
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
  updateStatusRegistration(registration: any) {
    return this.httpClient.put(this.apiBaseUrl + 'labregistration/updatestatus', registration);
  }
  updateRegistration(registration: any) {
    return this.httpClient.put(this.apiBaseUrl + 'labregistration/update', registration);
  }
  saveRegistration(registration: any) {
    return this.httpClient.post(this.apiBaseUrl + 'labregistration/save', registration);
  }
  
  getLabReport(data:any) {
    return this.httpClient.post(this.apiBaseUrl + 'labregistration/search', data);
  }

  evaluateFormula(data:any) {
    return this.httpClient.post(this.apiBaseUrl + 'evaluate', data);
  }
  
}
