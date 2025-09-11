import { DatePipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { SharedModule } from '@shared/shared.module';
import { AppointmentsService } from '../appointments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '@config';
import { LoginService } from 'app/authentication/login.service';

@Component({
  selector: 'app-dialogbox',
  standalone: true,
  templateUrl: './dialogbox.component.html',
  styleUrl: './dialogbox.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
  imports: [BreadcrumbComponent,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule, 
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
    SharedModule],
})
export class DialogboxComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public appointmentsService: AppointmentsService,
    private snackBar: MatSnackBar,
    public config: ConfigService,
    public loginService:LoginService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    // Initialization logic here

}}