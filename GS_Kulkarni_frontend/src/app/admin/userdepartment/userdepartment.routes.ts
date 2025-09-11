import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { UserDepartmentsComponent } from './userdepartment-list/userdepartment-list.component';

export const USERDEPARTMENT_ROUTE: Route[] = [
  {
    path: 'userdepartment-list',
    component: UserDepartmentsComponent,
  },
  { path: '**', component: Page404Component },
];

