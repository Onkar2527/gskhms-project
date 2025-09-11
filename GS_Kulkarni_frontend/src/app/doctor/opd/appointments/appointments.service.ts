import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Appointments } from './appointments.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';

import { ConfigService } from '@config';

@Injectable({
  providedIn: 'root',
})

export class AppointmentsService extends UnsubscribeOnDestroyAdapter {

  isTblLoading = true;
  apiBaseUrl: string = "";
  nodeApiUrl: string = "";
  dataChange: BehaviorSubject<Appointments[]> = new BehaviorSubject<
    Appointments[]
>([]);
  // Temporarily stores data from dialogs
  dialogData!: Appointments;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
    this.nodeApiUrl = config.getNodeApiUrl()
  }
  
  get data(): Appointments[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAppointmentss(data1:any={}): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'appointment/search', data1)
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

  getTodaysAppoinments(): void {
    let data1 = new Appointments();
    data1.appointmentDate = new Date();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;

    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'appointment/search', data1)
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

  getTodaysWaitingAppoinments(startDate: Date, endDate: Date): void {
    let data1 = new Appointments();
    // data1.appointmentDate = new Date();
    data1.appointmentStartDate = startDate;
    data1.appointmentEndDate = endDate;
    data1.statuses = ['Waiting','OnCall'];
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;

    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'appointment/search', data1)
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
  
  getFutureAppoinments(): void {
    let data1 = new Appointments();
    data1.appointmentDate = new Date();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;

    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'appointment/future', data1)
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

  getPastAppoinments(): void {
    let data1 = new Appointments();
    data1.appointmentDate = new Date();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;

    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'appointment/past', data1)
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

  getAppoinments(startDate: Date, endDate: Date, appointmentStatus: string): void {
    let data1 = new Appointments();
    data1.appointmentStartDate = startDate;
    data1.appointmentEndDate = endDate;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;
    if(appointmentStatus != 'All'){
      data1.statuses = [appointmentStatus];
    }

    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'appointment/search', data1)
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


  getspecialcases(data: any) {
    return this.httpClient.post(this.nodeApiUrl + 'specialcase/get', data);
  }

  addAppointments(appointments: Appointments) {
    return this.httpClient.post(this.apiBaseUrl + 'appointment/save', appointments);
  }

  updateAppoinment(data: any) {
    return this.httpClient.put(this.apiBaseUrl + 'appointment/update', data);
  }

 

  getAllAppoinment(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'appointment/search', data);
  }

  getCaualty(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'casualityheader/search', data);
  }

  getBedFacility(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'bed-facility/search', data);
  }

  saveBedFacility(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'bed-facility/save', data);
  }

   saveNursingAssessment(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'nursing-assessment/save', data);
  }
  
  getNursingAssessment(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'nursing-assessment/search', data);
  }

  saveDischargeSummary(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'discharge-summary/save', data);
  }

  getDischargeSummary(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'discharge-summary/search', data);
  }

  getBill(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'bill/search', data);
  }

  saveVitals(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'assessment-vital/save', data);
  }

  getVitals(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'assessment-vital/search', data);
  }
  
  saveContinuation(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'continuation-sheet/save', data);
  }

  getContinuations(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'continuation-sheet/search', data);
  }

  saveMedication(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'medication-order-sheet/save', data);
  }

  getMedications(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'medication-order-sheet/search', data);
  }

  saveCaualty(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'casualityheader/save', data);
  }

  saveLab(data: any) {
    return this.httpClient.post(this.apiBaseUrl + 'ipdlab-register/save', data);
  }
  
  updateAppointments(appointments: any) {
    return this.httpClient.put(this.apiBaseUrl + 'appointment/update', appointments);
  }

  updateAppointmentsPayment(payload: any) {
    return this.httpClient.post(this.nodeApiUrl + 'appointmentpayment/updateAppointments', payload);
  }

  deleteAppointments(id: number): void {
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

  savePatient(data:any) {
    return this.httpClient.post(this.apiBaseUrl + 'patient/save', data);
  }

  changeAppointment(appointmentId: number, data: any) {
    return this.httpClient.put(`${this.nodeApiUrl}appointment/${appointmentId}`, data);
  }

  specialCase(appointmentId: number, data: any) {
    return this.httpClient.put(`${this.nodeApiUrl}specialcases/${appointmentId}`, data);
  }

  // getSpecialCase(data: any) {
  //   return this.httpClient.post(this.apiBaseUrl + 'specialcases/get', data);
  // }

  // getSpecialCase(data: any) {
  //   return this.httpClient.post(this.apiBaseUrl + 'specialcases/get', data);
  // }

  // getSpecialCaseAppointments(data: any): void {
  //   this.httpClient.post<Appointments[]>(this.nodeApiUrl + 'specialcases/get', data)
  //     .subscribe((res: any) => {
  //       if (res.success) {
  //         this.dataChange.next(res.data); // trigger the table update
  //       } else {
  //         this.dataChange.next([]);
  //       }
  //     }, error => {
  //       console.error('Error fetching special cases:', error);
  //       this.dataChange.next([]);
  //     });
  // }


  getSpecialCaseAppointments(data: any): void {
    this.isTblLoading = true; // Start loading
  
    this.subs.sink = this.httpClient
      .post<any>(this.nodeApiUrl + 'specialcases/get', data)
      .subscribe({
        next: (res) => {
          this.isTblLoading = false;
          if (res.success) {
            this.dataChange.next(res.data); // Populate data
          } else {
            this.dataChange.next([]);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.error('Error fetching special cases:', error.name + ' - ' + error.message);
          this.dataChange.next([]);
        }
      });
  }
  


 
}
