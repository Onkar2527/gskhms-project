import { Route } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { TodayAppointmentComponent } from "./today-appointment/today-appointment.component";
import { BookAppointmentComponent } from "./book-appointment/book-appointment.component";
import { RecommendedAdmissionsComponent } from "./recommended-admissions/recommended-admissions.component";
import { RecommendedOperationsComponent } from "./recommended-operations/recommended-operations.component";
import { CashbookListComponent } from "./cashbook-list/cashbook-list.component";
import { OncallAppointmentComponent } from "./oncall-appointment/oncall-appointment.component";

export const PATIENT_APPOINTMENT_ROUTE: Route[] = [

  {
    path: "oncallbooking",
    component: OncallAppointmentComponent,
  },
  {
    path: "book",
    component: BookAppointmentComponent,
  },
  {
    path: "today",
    component: TodayAppointmentComponent,
  },
   {
      path: "cashbook",
      component: CashbookListComponent,
    },
  {
    path: "recommended-admissions",
    component: RecommendedAdmissionsComponent,
  },
  {
    path: "recommended-operations",
    component: RecommendedOperationsComponent,
  },
  { path: "**", component: Page404Component },
];

