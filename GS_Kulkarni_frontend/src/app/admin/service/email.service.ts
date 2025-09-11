import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';
import { Bank } from '../model/bank.model';

@Injectable({
  providedIn: 'root',
})

export class EmailService extends UnsubscribeOnDestroyAdapter {
 
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
 

  sendEmail(formData: FormData) {
    return this.httpClient.post(this.apiBaseUrl + 'email/send', formData);
  }

}
