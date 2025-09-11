import { Page404Component } from "../authentication/page404/page404.component";
import { Route } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BillingComponent } from "./billing/billing.component";
import{ TodayAppointmentComponent } from "./today-appointment/today-appointment.component";
import { MakePaymentComponent } from "./make-payment/make-payment.component";
import { TodaysPaymentsComponent } from "./todays-payments/todays-payments.component";

export const ACCOUNT_ROUTE: Route[] = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "registration",
    component: TodayAppointmentComponent,
  },
  {
    path: "billing",
    component: BillingComponent,
  },
  {
    path: "payment",
    component: MakePaymentComponent,
  },
  {
    path: "todays-payments",
    component: TodaysPaymentsComponent,
  },
  {
     path: "**", component: Page404Component
  },
];

