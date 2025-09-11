import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { AddDesignationComponent } from './add-designation/add-designation.component';

export const DESIGNATION_ROUTE: Route[] = [
  {
    path: 'designation-list',
    component: DesignationListComponent,
  },
  {
    path: 'add-designation',
    component: AddDesignationComponent,
  },
  { path: '**', component: Page404Component },
];

