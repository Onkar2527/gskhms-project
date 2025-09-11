import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { PatientcompanyComponent } from './patientcompany-list/patientcompany-list.component';

export const PATIENTS_COMPANY_ROUTE: Route[] = [
  {
    path: 'patientcompany-list',
    component: PatientcompanyComponent,
  },
  { path: '**', component: Page404Component },
];

