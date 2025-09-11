import { DashboardComponent as patientDashboard } from "../../reception/dashboard/dashboard.component";
import { DashboardComponent as doctorDashboard } from "../../doctor/dashboard/dashboard.component";
import { DashboardComponent as acountantDashboard } from "../../accountant/dashboard/dashboard.component";
import { Page404Component } from "../../authentication/page404/page404.component";
import { Route } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { Dashboard2Component } from "./dashboard2/dashboard2.component";
export const DASHBOARD_ROUTE: Route[] = [
  {
    path: "",
    redirectTo: "main",
    pathMatch: "full",
  },
  {
    path: "main",
    component: MainComponent,
  },
  {
    path: "dashboard2",
    component: Dashboard2Component,
  },
  {
    path: "doctor-dashboard",
    component: doctorDashboard,
  },
  {
    path: "patient-dashboard",
    component: patientDashboard,
  },
  {
    path: "accountant-dashboard",
    component: acountantDashboard,
  },
  { path: "**", component: Page404Component },
];
