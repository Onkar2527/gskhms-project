import { Route } from "@angular/router";
import { AllEmployeesComponent } from "./allemployees/allemployees.component";
import { AddEmployeeComponent } from "./add-employee/add-employee.component";
import { EmployeeProfileComponent } from "./employee-profile/employee-profile.component";
import { Page404Component } from "../../authentication/page404/page404.component";
export const EMPLOYEE_ROUTE: Route[] = [
  {
    path: "all-employees",
    component: AllEmployeesComponent,
  },
  {
    path: "add-employee",
    component: AddEmployeeComponent,
  },
  {
    path: "employee-profile",
    component: EmployeeProfileComponent,
  },
  { path: "**", component: Page404Component },
];
