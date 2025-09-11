import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { Page404Component } from '../authentication/page404/page404.component';
import { AppointmentsComponent } from './opd/appointments/appointments.component';
import { CasualtyAppointmentsComponent } from './opd/appointments/casualty-appointments/casualty-appointments.component';
import { CompletedAppointmentsComponent } from './opd/appointments/completed-appointments/completed-appointments.component';
import { InitialClinicalAssessmentComponent } from './ipd/initial-clinical-assessment/initial-clinical-assessment.component';
import { EmergencyClinicalAssessmentComponent } from './ipd/emergency-clinical-assessment/emergency-clinical-assessment.component';
import { InitialClinicalAssessmentListComponent } from './ipd/initial-clinical-assessment-list/initial-clinical-assessment-list.component';
import { EmergencyClinicalAssessmentListComponent } from './ipd/emergency-clinical-assessment-list/emergency-clinical-assessment-list.component';
import { IPDCompletedAppointmentsComponent } from './ipd/completed-appointments/completed-appointments.component';
import { CalendarComponent } from './ot/registration/calendar.component';
import { OperationsComponent } from './ot/operations/operations.component';
import { SpecialCasesComponent } from './opd/appointments/special-cases/special-cases.component';

export const DOCTOR_ROUTE: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'casualty-appointments',
    component: CasualtyAppointmentsComponent,
  },
  {
    path: 'appointments',
    component: AppointmentsComponent,
  },
  {
    path: 'completed-appointments',
    component: CompletedAppointmentsComponent,
  },

  {
    path: 'special-cases',
    component: SpecialCasesComponent,
  },


  {
    path: 'ipd-completed-appointments',
    component: IPDCompletedAppointmentsComponent,
  },

  {
    path: 'initial-clinical-assessment',
    component: InitialClinicalAssessmentComponent,
  },
  {
    path: 'initial-clinical-assessment-list',
    component: InitialClinicalAssessmentListComponent,
  },
  {
    path: 'emergency-clinical-assessment-list',
    component: EmergencyClinicalAssessmentListComponent,
  },
  {
    path: 'emergency-clinical-assessment',
    component: EmergencyClinicalAssessmentComponent,
  },
  {
    path: 'doctors',
    component: DoctorsComponent,
  },{
    path: 'ot-registration',
    component: CalendarComponent,
  },{
    path: 'operations',
    component: OperationsComponent,
  },
  { path: '**', component: Page404Component },
];

