import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InitialClinicalAssessment } from '../model/initial-clinical-assessment.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Injectable({
  providedIn: 'root'
})
export class InitialClinicalAssessmentService extends UnsubscribeOnDestroyAdapter {

  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<InitialClinicalAssessment[]> = new BehaviorSubject<InitialClinicalAssessment[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: InitialClinicalAssessment;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }

  get data(): InitialClinicalAssessment[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAssessments(): void {
    let data1 = new InitialClinicalAssessment();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;

    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'clinical-assessment/search', data1)
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

  addAssessment(appointments: InitialClinicalAssessment) {
    return this.httpClient.post(this.apiBaseUrl + 'clinical-assessment/save', appointments);
  }

  updateAssessment(data: any) {
    return this.httpClient.put(this.apiBaseUrl + 'clinical-assessment/update', data);
  }
}
