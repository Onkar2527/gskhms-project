import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { OccupationListComponent } from './occupation-list/occupation-list.component';

export const OCCUPATION_ROUTE: Route[] = [
  {
    path: 'occupation-list',
    component: OccupationListComponent,
  },
  { path: '**', component: Page404Component },
];

