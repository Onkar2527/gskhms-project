import { Route } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { AddConsumeComponent } from "./add-consume/add-consume.component";
import { ConsumeListComponent } from "./consume-list/consume-list.component";
export const CONSUME_ROUTE: Route[] = [
    {
      path: "add-consume",
      component: AddConsumeComponent,
    },
    {
      path: "consume-list",
      component: ConsumeListComponent,
    },
    { path: "**", component: Page404Component },
  ];