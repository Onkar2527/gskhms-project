import { Page404Component } from "../authentication/page404/page404.component";
import { Route } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { BedManagementComponent } from "./bed-management/bed-management.component";
import { FormDialogComponent } from "./appointments/today-appointment/dialogs/form-dialog/form-dialog.component";

export const RECEPTION_ROUTE: Route[] = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "bed-management",
    component: BedManagementComponent,
  },

  {
    path: "package-management",
    component: FormDialogComponent,
  },
  {
    path: "appointments",
    loadChildren: () =>
      import("./appointments/patient-appointments.routes").then(
        (m) => m.PATIENT_APPOINTMENT_ROUTE
      ),
  },
  { path: "**", component: Page404Component },
];

