import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from './core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { Page404Component } from './authentication/page404/page404.component';
import { Role } from './core';

export const APP_ROUTE: Route[] = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/authentication/signin', pathMatch: 'full' },
            {
                path: 'admin',
                canActivate: [AuthGuard],
                data: {
                    role: Role.Admin,
                },
                loadChildren: () =>
                    import('./admin/admin.routes').then((m) => m.ADMIN_ROUTE),
            },
            {
                path: 'doctor',
                canActivate: [AuthGuard],
                data: {
                    role: [Role.Doctor, Role.Nurse,Role.RMO]
                },
                loadChildren: () =>
                    import('./doctor/doctor.routes').then((m) => m.DOCTOR_ROUTE),
            },
            {
                path: 'reception',
                canActivate: [AuthGuard],
                data: {
                    role: Role.Receptionist,
                },
                loadChildren: () =>
                    import('./reception/reception.routes').then((m) => m.RECEPTION_ROUTE),
            },
            {
                path: 'accountant',
                canActivate: [AuthGuard],
                data: {
                    role: Role.Accountant,
                },
                loadChildren: () =>
                    import('./accountant/accountant.routes').then((m) => m.ACCOUNT_ROUTE),
            },
            {
                path: 'nurse',
                canActivate: [AuthGuard],
                data: {
                    role: [Role.Doctor, Role.Nurse,]
                },
                loadChildren: () =>
                    import('./nurse/nurse.routes').then((m) => m.NURSE_ROUTE),
            },
            {
                path: 'lab',
                canActivate: [AuthGuard],
                data: {
                    role: Role.Lab,
                },
                loadChildren: () =>
                    import('./lab/lab.routes').then((m) => m.LAB_ROUTE),
            },
            {
                path: 'calendar',
                loadChildren: () =>
                    import('./calendar/calendar.routes').then((m) => m.CALENDAR_ROUTE),
            },
            {
                path: 'task',
                loadChildren: () =>
                    import('./task/task.routes').then((m) => m.TASK_ROUTE),
            },
            {
                path: 'contacts',
                loadChildren: () =>
                    import('./contacts/contacts.routes').then((m) => m.CONTACT_ROUTE),
            },
            {
                path: 'email',
                loadChildren: () =>
                    import('./email/email.routes').then((m) => m.EMAIL_ROUTE),
            },
            {
                path: 'apps',
                loadChildren: () =>
                    import('./apps/apps.routes').then((m) => m.APPS_ROUTE),
            },
        ],
    },
    {
        path: 'authentication',
        component: AuthLayoutComponent,
        loadChildren: () =>
            import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
    },
    { path: '**', component: Page404Component },
];
