import { Route } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { AddRouteComponent } from "./add-route/add-route.component";
import { RouteListComponent } from "./route-list/route-list.component";
export const ROUTE_ROUTE: Route[] = [
    {
      path: "add-route",
      component: AddRouteComponent,
    },
    {
      path: "route-list",
    component: RouteListComponent,
    },
    { path: "**", component: Page404Component },
  ];