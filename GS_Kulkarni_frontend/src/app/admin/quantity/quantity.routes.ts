import { Route } from "@angular/router";
import { Page404Component } from "../../authentication/page404/page404.component";
import { AddQuantityComponent } from "./add-quantity/add-quantity.component";
import { QuantityListComponent } from "./quantity-list/quantity-list.component";
export const QUANTITY_ROUTE: Route[] = [
    {
      path: "add-quantity",
      component: AddQuantityComponent,
    },
    {
      path: "quantity-list",
      component: QuantityListComponent,
    },
    { path: "**", component: Page404Component },
  ];