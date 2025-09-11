import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';
import { Route } from '../model/route.model';

@Injectable({
  providedIn: 'root',
})

export class RouteService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<Route[]> = new BehaviorSubject<Route[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Route;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Route[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getRouteList(): void {
    const req = new Route();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.get<any>(this.apiBaseUrl + 'route/search').subscribe({
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

  getRouteById(id: number) {
    return this.httpClient.get(this.apiBaseUrl + 'route/search/' + id);
  }
  getRouteByCriteria(route: Route) {
    return this.httpClient.post(this.apiBaseUrl + 'route/search', route);
  }

  addRoute(route: Route) {
    return this.httpClient.post(this.apiBaseUrl + 'route/save', route);
  }

  updateRoute(route: Route) {
    return this.httpClient.put(this.apiBaseUrl + 'route/update', route);
  }

}
