import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';
import { Consume } from '../model/consume.model';

@Injectable({
  providedIn: 'root',
})

export class ConsumeService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Consume[]> = new BehaviorSubject<Consume[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Consume;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Consume[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getConsumeList(): void {
    const req = new Consume();
    this.subs.sink = this.httpClient.get<any>(this.apiBaseUrl + 'consume/search').subscribe({
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

  getConsumeById(id: number) {
    return this.httpClient.get(this.apiBaseUrl + 'consume/search/' + id);
  }
  getConsumeByCriteria(consume: Consume) {
    return this.httpClient.post(this.apiBaseUrl + 'consume/search', consume);
  }

  addConsume(consume: Consume) {
    return this.httpClient.post(this.apiBaseUrl + 'consume/save', consume);
  }

  updateConsume(consume: Consume) {
    return this.httpClient.put(this.apiBaseUrl + 'consume/update', consume);
  }

}
