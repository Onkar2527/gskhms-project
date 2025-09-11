import { Route } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { AddDosesComponent } from "./add-doses/add-doses.component";
import { DosesListComponent } from "./doses-list/doses-list.component";
export const DOSES_ROUTE: Route[] = [
    {
      path: "add-doses",
      component: AddDosesComponent,
    },
    {
      path: "doses-list",
      component: DosesListComponent,
    },
    { path: "**", component: Page404Component },
  ];