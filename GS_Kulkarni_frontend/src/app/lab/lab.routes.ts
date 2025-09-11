import { Page404Component } from "../authentication/page404/page404.component";
import { Route } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RegistrationListComponent } from "./registration/registration-list/registration-list.component";
import { XRayRegistrationListComponent } from "./x-ray-registration/x-ray-registration-list/x-ray-registration-list.component";
import { WaitingForApprovalComponent } from "./registration/waiting-for-approval/waiting-for-approval.component";
import { ApproveLabRegComponent } from "./registration/approve-lab-reg/approve-lab-reg.component";
import { SampleCollectedListComponent } from "./registration/sample-collected-list/sample-collected-list.component";
import { SonographyRegistrationListComponent } from "./sonography-registration/sonography-list.component";
export const LAB_ROUTE: Route[] = [
  {
    path: "dashboard",
    component: DashboardComponent,
  },{
    path: "registration-list",
    component: RegistrationListComponent,
  },{
    path: "sample-collected-list",
    component: SampleCollectedListComponent,
  },{
    path: "registration-list-pending",
    component: WaitingForApprovalComponent,
  },{
    path: "registration-list-approve",
    component: ApproveLabRegComponent,
  },{
    path: "x-ray-registration-list",
    component: XRayRegistrationListComponent,
  },
  {
    path: "sonography-registration-list",
    component: SonographyRegistrationListComponent,
  },
  { path: "**", component: Page404Component },
];

