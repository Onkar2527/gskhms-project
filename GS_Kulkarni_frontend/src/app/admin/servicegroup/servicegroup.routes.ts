import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { ServiceGroupComponent } from './servicegroup-list/servicegroup-list.component';

export const SERVICE_GROUP_ROUTE: Route[] = [
  {
    path: 'servicegroup-list',
    component: ServiceGroupComponent,
  },
  { path: '**', component: Page404Component },
];

