import { Route } from '@angular/router';
import { Page404Component } from '../../authentication/page404/page404.component';
import { ServicesComponent } from './services-list/services-list.component';

export const SERVICES_ROUTE: Route[] = [
  {
    path: 'services-list',
    component: ServicesComponent,
  },
  { path: '**', component: Page404Component },
];

