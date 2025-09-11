import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { PatientscategoryListComponent } from './patientscategory-list/patientscategory-list.component';

export const PATIENTS_CATEGORY_ROUTE: Route[] = [
  {
    path: 'patientscategory-list',
    component: PatientscategoryListComponent,
  },
  { path: '**', component: Page404Component },
];

