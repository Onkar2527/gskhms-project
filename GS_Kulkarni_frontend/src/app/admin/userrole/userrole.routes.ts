import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { UserRoleComponent } from './userrole-list/userrole-list.component';

export const USER_ROLE_ROUTE: Route[] = [
  {
    path: 'userrole-list',
    component: UserRoleComponent,
  },
  { path: '**', component: Page404Component },
];

