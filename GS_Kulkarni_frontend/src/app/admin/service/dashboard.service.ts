import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { ConfigService } from '@config';

@Injectable({
  providedIn: 'root',
})

export class DashboardService extends UnsubscribeOnDestroyAdapter {  
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }

  getReceptionDashboardData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    return this.httpClient.post(this.apiBaseUrl + 'dashboard/reception', {
        hospitalId: currentUser.hospitalId
    });
  }

  getAccountDashboardData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    return this.httpClient.post(this.apiBaseUrl + 'dashboard/account', {
        hospitalId: currentUser.hospitalId
    });
  }
  
  getDoctorDashboardData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    return this.httpClient.post(this.apiBaseUrl + 'dashboard/doctor', {
        hospitalId: currentUser.hospitalId
    });
  }

  getAdminDashboardData(){
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    return this.httpClient.post(this.apiBaseUrl + 'dashboard/admin', {
        hospitalId: currentUser.hospitalId
    });
  }
}
