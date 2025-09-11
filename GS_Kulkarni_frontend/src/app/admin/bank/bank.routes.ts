import { Route } from '@angular/router';
import { Page404Component } from 'app/authentication/page404/page404.component';
import { BankListComponent } from './bank-list/bank-list.component';

export const BANK_ROUTE: Route[] = [
  {
    path: 'bank-list',
    component: BankListComponent,
  },
  { path: '**', component: Page404Component },
];

