import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Calendar } from './calendar.model';
import { Observable } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';

@Injectable({
  providedIn: 'root',
})

export class CalendarService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/calendar.json';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  dataChange: BehaviorSubject<Calendar[]> = new BehaviorSubject<Calendar[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: any;
  apiBaseUrl: string = "";
  isTblLoading = true;

  constructor(private httpClient: HttpClient, private config: ConfigService) { 
    super();
    this.apiBaseUrl = config.getApiUrl();
  }

  get data(): Calendar[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getAllCalendars(): Observable<Calendar[]> {
    return this.httpClient
      .get<Calendar[]>(this.API_URL)
      .pipe(catchError(this.errorHandler));
  }

  addUpdateCalendar(otRegistration: any) {
    return this.httpClient.post(this.apiBaseUrl + 'otregistration/save', otRegistration);
  }
  
  getAllOperations() {
    let data1: any = {};
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;
    return this.httpClient.post(this.apiBaseUrl + 'otregistration/search', data1);
  }

  getOperation(data1: any) {
    return this.httpClient.post(this.apiBaseUrl + 'otregistration/search', data1);
  }

  deleteCalendar(calendar: Calendar): void {
    this.dialogData = calendar;
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getOperations(data: any): void {
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'otregistration/search', data)
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

  saveOperationSummary(operationSummary: any) {
    return this.httpClient.put(this.apiBaseUrl + 'operation-status/update', operationSummary);
  }

  getOperationSummary(data1: any) {
    return this.httpClient.post(this.apiBaseUrl + 'operation-status/search', data1);
  }

}
