import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { Specialization } from '../model/specialization.model';

@Injectable({
  providedIn: 'root',
})

export class SpecializationService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<Specialization[]> = new BehaviorSubject<Specialization[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Specialization;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Specialization[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getSpecializationLists(): void {
    const data1 = new Specialization();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'specialization/search', data1)
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data.data);
          console.log("data", data)
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
          console.log(error.name + ' ' + error.message);
        },
      });
  }
  addSpecialization(req: Specialization):void {
    this.httpClient.post(this.apiBaseUrl + 'specialization/save', req)
        .subscribe({
          next: (data) => {
            this.dialogData = req;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updateSpecialization(req: Specialization) :void{
    this.httpClient.post(this.apiBaseUrl + 'specialization/save', req)
        .subscribe({
          next: (data) => {
            this.dialogData = req;
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
          },
        });
  }
}
