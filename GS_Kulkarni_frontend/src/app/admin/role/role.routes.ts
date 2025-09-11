import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { RoleListComponent } from './role-list/role-list.component';

export const ROLE_ROUTE: Route[] = [
  {
    path: 'role-list',
    component: RoleListComponent,
  },
  { path: '**', component: Page404Component },
];

