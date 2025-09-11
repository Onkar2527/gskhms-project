import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { SubdepartmentsListComponent } from './subdepartments-list/subdepartments-list.component';

export const SUBDEPARTMENTS_ROUTE: Route[] = [
  {
    path: 'subdepartments-list',
    component: SubdepartmentsListComponent,
  },
  { path: '**', component: Page404Component },
];

