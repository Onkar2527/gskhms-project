import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { Patient } from 'app/admin/patients/allpatients/patient.model';

@Injectable({
  providedIn: 'root',
})

export class PatientService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/patient.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Patient;
  apiBaseUrl: string ="";
  
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  
  get data(): Patient[] {
    return this.dataChange.value;
  }
  
  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllPatients(mobile: any): void { 
    const req = new Patient();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    req.hospitalId = currentUser.hospitalId;
    req.mobileNumber = mobile;
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'patient/search', req).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
      },
    });
  }

  getAllPatientsByMobileNumber(mobile: any){
    const req = new Patient();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    req.hospitalId = currentUser.hospitalId;
    req.mobileNumber = mobile;
    return this.httpClient.post<any>(this.apiBaseUrl + 'patient/search', req)
  }

  getAllPatientsByMNumberFnameLname(mobile: any, firstName: any, lastName: any){
    const req = new Patient();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    req.hospitalId = currentUser.hospitalId;
    if(mobile){
      req.mobileNumber = mobile;
    }
    if(firstName){
      req.firstName = firstName;
    }
    if(lastName){
      req.lastName = lastName;
    }
    return this.httpClient.post<any>(this.apiBaseUrl + 'patient/search', req)
  }

  getPatientByCriteria(patient: Patient){
    return this.httpClient.post(this.apiBaseUrl + 'patient/search', patient);
  }

  addPatient(patient: Patient) {
    return this.httpClient.post(this.apiBaseUrl + 'patient/save', patient);
  }
  
  updatePatient(patient: Patient) {
    return this.httpClient.put(this.apiBaseUrl + 'patient/update', patient);
  }
  
  deletePatient(id: number): void {
    console.log(id);

    // this.httpClient.delete(this.API_URL + id)
    //     .subscribe({
    //       next: (data) => {
    //         console.log(id);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //          // error code here
    //       },
    //     });
  }
}
