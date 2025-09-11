import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { Section } from '../model/section.model';

@Injectable({
  providedIn: 'root',
})

export class SectionService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<Section[]> = new BehaviorSubject<Section[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Section;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Section[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getSectionList(): void {
    const data1 = new Section();
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + 'section/search', data1)
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
  addSection(req: Section):void {
    this.httpClient.post(this.apiBaseUrl + 'section/save', req)
        .subscribe({
          next: (data) => {
            this.dialogData = req;
          },
          error: (error: HttpErrorResponse) => {
             console.log(error);
          },
        });
  }
  updateSection(req: Section) :void{
    this.httpClient.put(this.apiBaseUrl + 'section/update', req)
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
