import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { EmergencyClinicalAssessment } from '../model/emergency-clinical-assessment.model';

@Injectable({
  providedIn: 'root'
})
export class EmergencyClinicalAssessmentService extends UnsubscribeOnDestroyAdapter {

  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<EmergencyClinicalAssessment[]> = new BehaviorSubject<EmergencyClinicalAssessment[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: EmergencyClinicalAssessment;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }

  get data(): EmergencyClinicalAssessment[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAssessments(): void {
    let data1 = new EmergencyClinicalAssessment();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;

    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'emergency-assessment/search', data1)
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

  addAssessment(appointments: EmergencyClinicalAssessment) {
    return this.httpClient.post(this.apiBaseUrl + 'emergency-assessment/save', appointments);
  }

  updateAssessment(data: any) {
    return this.httpClient.put(this.apiBaseUrl + 'emergency-assessment/update', data);
  }
}
