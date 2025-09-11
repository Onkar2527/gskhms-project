import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { AddFileUpload } from '../model/addFileUpload.model';

@Injectable({
  providedIn: 'root',
})

export class AddFileUploadService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  apiBaseUrl: string = "";
  dataChange: BehaviorSubject<AddFileUpload[]> = new BehaviorSubject<AddFileUpload[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: AddFileUpload;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  
  get data(): AddFileUpload[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }
  
  /** CRUD METHODS */
  getAddFileUpload(docTypeId: string): void {
    const data1 = new  AddFileUpload();
    data1.docTypeId = docTypeId;
    this.subs.sink = this.httpClient
      .post<any>(this.apiBaseUrl + '/files/{docTypeId}/{docType}/{filename:.+}', data1)
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

  getfiles(docId: number, docType: string): void {
    this.subs.sink = this.httpClient
      .get<any>(this.apiBaseUrl + 'upload/files?docId='+docId+'&userId='+docType)
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

  addAddFileUpload(req: AddFileUpload) {
    return this.httpClient.post(this.apiBaseUrl + 'upload/save', req);
  }

  deleteAddFileUpload(req: AddFileUpload) {
    return this.httpClient.post(this.apiBaseUrl + 'upload/delete', req);
  }
}
