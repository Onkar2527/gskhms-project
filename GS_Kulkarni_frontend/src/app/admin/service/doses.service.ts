import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';
import { Doses } from '../model/doses.model';

@Injectable({
  providedIn: 'root',
})

export class DosesService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Doses[]> = new BehaviorSubject<Doses[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Doses;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Doses[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getDosesList(): void {
    const req = new Doses();
    this.subs.sink = this.httpClient.get<any>(this.apiBaseUrl + 'doses/search').subscribe({
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

  getDosesById(id: number) {
    return this.httpClient.get(this.apiBaseUrl + 'doses/search/' + id);
  }
  getDosesByCriteria(doses: Doses) {
    return this.httpClient.post(this.apiBaseUrl + 'doses/search', doses);
  }

  addDoses(doses: Doses) {
    return this.httpClient.post(this.apiBaseUrl + 'doses/save', doses);
  }

  updateDoses(doses: Doses) {
    return this.httpClient.put(this.apiBaseUrl + 'doses/update', doses);
  }

}
