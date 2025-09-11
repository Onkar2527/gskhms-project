import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { SectionComponent } from './section-list/section-list.component';

export const SECTION_ROUTE: Route[] = [
  {
    path: 'section-list',
    component: SectionComponent,
  },
  { path: '**', component: Page404Component },
];

