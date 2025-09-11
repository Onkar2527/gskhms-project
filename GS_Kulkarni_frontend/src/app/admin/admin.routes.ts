import { Route } from '@angular/router';

export const ADMIN_ROUTE: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTE),
  },
  {
    path: 'appointment',
    loadChildren: () =>
      import('./appointment/appointment.routes').then(
        (m) => m.APPOINTMENT_ROUTE
      ),
  },
  {
    path: 'doctors',
    loadChildren: () =>
      import('./doctors/doctors.routes').then((m) => m.DOCTOR_ROUTE),
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./employees/employees.routes').then((m) => m.EMPLOYEE_ROUTE),
  },
  {
    path: 'patients',
    loadChildren: () =>
      import('./patients/patients.routes').then((m) => m.PATIENT_ROUTE),
  },
  {
    path: 'patientscategory',
    loadChildren: () =>
      import('./patientscategory/patientscategory.routes').then((m) => m.PATIENTS_CATEGORY_ROUTE),
  },
  {
    path: 'patientcompany',
    loadChildren: () =>
      import('./patientcompany/patientcompany.routes').then((m) => m.PATIENTS_COMPANY_ROUTE),
  },
  {
    path: 'ratetype',
    loadChildren: () =>
      import('./ratetype/ratetype.routes').then((m) => m.RATE_TYPE_ROUTE),
  },
  {
    path: 'bank',
    loadChildren: () =>
      import('./bank/bank.routes').then((m) => m.BANK_ROUTE),
  },
  {
    path: 'role',
    loadChildren: () =>
      import('./role/role.routes').then((m) => m.ROLE_ROUTE),
  },
  {
    path: 'specialization',
    loadChildren: () =>
      import('./specialization/specialization.routes').then((m) => m.SPECIALIZATION_ROUTE),
  },
  {
    path: 'servicegroup',
    loadChildren: () =>
      import('./servicegroup/servicegroup.routes').then((m) => m.SERVICE_GROUP_ROUTE),
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./services/services.routes').then((m) => m.SERVICES_ROUTE),
  },
  {
    path: 'userdepartment',
    loadChildren: () =>
      import('./userdepartment/userdepartment.routes').then((m) => m.USERDEPARTMENT_ROUTE),
  },
  {
    path: 'userrole',
    loadChildren: () =>
      import('./userrole/userrole.routes').then((m) => m.USER_ROLE_ROUTE),
  },
  {
    path: 'section',
    loadChildren: () =>
      import('./section/section.routes').then((m) => m.SECTION_ROUTE),
  },
  {
    path: 'billing',
    loadChildren: () =>
      import('./billing/billing.routes').then((m) => m.BILLING_ROUTE),
  },
  {
    path: 'room',
    loadChildren: () => import('./room/room.routes').then((m) => m.ROOMS_ROUTE),
  },
  {
    path: 'departments',
    loadChildren: () =>
      import('./departments/departments.routes').then(
        (m) => m.DEPARTMENT_ROUTE
      ),
  },
  {
    path: 'subdepartments',
    loadChildren: () =>
      import('./subdepartments/subdepartments.routes').then((m) => m.SUBDEPARTMENTS_ROUTE),
  },
  {
    path: 'designation',
    loadChildren: () =>
      import('./designation/designation.routes').then((m) => m.DESIGNATION_ROUTE),
  },
  {
    path: 'occupation',
    loadChildren: () =>
      import('./occupation/occupation.routes').then((m) => m.OCCUPATION_ROUTE),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.routes').then((m) => m.INVENTORY_ROUTE),
  },
  {
    path: 'records',
    loadChildren: () =>
      import('./records/records.routes').then((m) => m.RECORDS_ROUTE),
  },
  {
    path: 'ambulance',
    loadChildren: () =>
      import('./ambulance/ambulance.routes').then((m) => m.AMBULANCE_ROUTE),
  },
  {
    path: 'pharmacy',
    loadChildren: () =>
      import('./pharmacy/pharmacy.routes').then((m) => m.PHARMACY_ROUTE),
  },
  {
    path: 'hospital',
    loadChildren: () =>
      import('./hospital/hospital.routes').then((m) => m.HOSPITAL_ROUTE),
  },
  {
    path: 'route',
    loadChildren: () =>
      import('./route/route.routes').then((m) => m.ROUTE_ROUTE),
  },
  {
    path: 'master',
    loadChildren: () =>
      import('./masters/master.routes').then((m) => m.MASTER_ROUTE),
  },
  {
    path: 'consume',
    loadChildren: () =>
      import('./consume/consume.routes').then((m) => m.CONSUME_ROUTE),
  },
  {
    path: 'doses',
    loadChildren: () =>
      import('./doses/doses.routes').then((m) => m.DOSES_ROUTE),
  },
  {
    path: 'quantity',
    loadChildren: () =>
      import('./quantity/quantity.routes').then((m) => m.QUANTITY_ROUTE),
  }
];
