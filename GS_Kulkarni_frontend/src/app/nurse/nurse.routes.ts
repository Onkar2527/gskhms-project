import { Page404Component } from "../authentication/page404/page404.component";
import { Route } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PrescriptionsComponent } from "./prescriptions/prescriptions.component";
import { MedicalRecordsComponent } from "./medical-records/medical-records.component";
import { BillingComponent } from "./billing/billing.component";
import { SettingsComponent } from "./settings/settings.component";
import { BedManagementComponent } from "./bed-management/bed-management.component";
import { MyPatientsComponent } from "./bed-management/my-patients/my-patients.component";
export const NURSE_ROUTE: Route[] = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },
  {
    path: "appointments",
    loadChildren: () =>
      import("./appointments/patient-appointments.routes").then(
        (m) => m.PATIENT_APPOINTMENT_ROUTE
      ),
  },
  {
    path: "prescriptions",
    component: PrescriptionsComponent,
  },
  {
    path: "records",
    component: MedicalRecordsComponent,
  },
  {
    path: "billing",
    component: BillingComponent,
  },
  {
    path: "bed-management",
    component: BedManagementComponent,
  },
  {
    path: "my-patients",
    component: MyPatientsComponent,
  },
  {
    path: "settings",
    component: SettingsComponent,
  },
  { path: "**", component: Page404Component },
];

