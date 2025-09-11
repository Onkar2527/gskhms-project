import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { RateTypeListComponent } from './ratetype-list/ratetype-list.component';

export const RATE_TYPE_ROUTE : Route[] = [
  {
    path: 'ratetype-list',
    component: RateTypeListComponent,
  },
  { path: '**', component: Page404Component },
];

