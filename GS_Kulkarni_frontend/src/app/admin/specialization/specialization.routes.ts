import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { SpecializationListComponent } from './specialization-list/specialization-list.component';

export const SPECIALIZATION_ROUTE: Route[] = [
  {
    path: 'specialization-list',
    component: SpecializationListComponent,
  },
  { path: '**', component: Page404Component },
];

