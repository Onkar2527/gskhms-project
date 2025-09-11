import { Route } from "@angular/router";
import { AddHospitalComponent } from "./add-hospital/add-hospital.component";
import { HospitalListComponent } from "./hospital-list/hospital-list.component";
import { Page404Component } from "../../authentication/page404/page404.component";
export const HOSPITAL_ROUTE: Route[] = [
    {
      path: "add-hospital",
      component: AddHospitalComponent,
    },
    {
      path: "hospital-list",
    component: HospitalListComponent,
    },
    { path: "**", component: Page404Component },
  ];