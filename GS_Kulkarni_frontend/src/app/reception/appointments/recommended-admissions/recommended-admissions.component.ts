import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter } from '@shared';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgClass, DatePipe, formatDate } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ConfigService } from '@config';
import { MatMenuModule } from '@angular/material/menu';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-recommended-admissions',
  templateUrl: './recommended-admissions.component.html',
  styleUrls: ['./recommended-admissions.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
  standalone: true,
  imports: [
    MatMenuModule,
    BreadcrumbComponent,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule
  ],
})
export class RecommendedAdmissionsComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'name',
    'mobileNumber',
    'gender',
    'dob',
    'address',
    'appointmentDate',
    'admissionDetails'
  ];

  exampleDatabase?: AppointmentsService;
  dataSource!: ExampleDataSource;
  id: any;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public config: ConfigService,
    public appointmentsService: AppointmentsService, 
    public datepipe: DatePipe
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  public loadData() {
    this.sort.active = 'appointmentDate';
    this.sort.direction = 'desc';
    this.exampleDatabase = new AppointmentsService(this.httpClient, this.config);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort,
      this.startDate,
      this.endDate,
    );
    this.subs.sink = fromEvent(this.filter?.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter?.nativeElement.value;
      }
    );
  }

   // export table data in excel file
   exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        'Name': x.namePrefix+ ' '+x.firstName + ' ' + x.lastName,
        'Mobile NO': x.mobileNumber,
        'Gender': x.gender,
        'Dob': formatDate(new Date(x.dob), 'yyyy-MM-dd', 'en'),
        'Address': x.address,
        'Status': x.status,
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  exportPDF() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        'Name': x.namePrefix+ ' '+x.firstName + ' ' + x.lastName,
        'Mobile NO': x.mobileNumber,
        'Gender': x.gender,
        'Dob': formatDate(new Date(x.dob), 'yyyy-MM-dd', 'en'),
        'Address': x.address,
        'Status': x.status,
      }));
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    TableExportUtil.exportToPDF(exportData, 'Recomended Admits For Dates: ' + formatDate(this.startDate, format, locale) + ' to ' + formatDate(this.endDate, format, locale));
  }
}

export class ExampleDataSource extends DataSource<Appointments> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Appointments[] = [];
  renderedData: Appointments[] = [];
  constructor(
    public exampleDatabase: AppointmentsService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    public startDate: Date,
    public endDate: Date,
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Appointments[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    let appointment = new Appointments();
    appointment.admissionRecommended = true;
    appointment.appointmentStartDate = this.startDate;
    appointment.appointmentEndDate = this.endDate;
    this.exampleDatabase.getAllAppointmentss(appointment);
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((appointments: Appointments) => {
            const searchStr = (
              appointments.id +
              appointments.namePrefix +
              appointments.firstName +
              appointments.lastName +
              appointments.mobileNumber +
              appointments.gender +
              appointments.address +
              appointments.admissionDetails +
              appointments.appointmentDate 
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() { }
  /** Returns a sorted copy of the database data. */
  sortData(data: Appointments[]): Appointments[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string | Date = '';
      let propertyB: number | string | Date = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'namePrefix':
          [propertyA, propertyB] = [a.namePrefix, b.namePrefix];
          break;
          case 'firstName':
          [propertyA, propertyB] = [a.firstName, b.firstName];
          break;
        case 'lastName':
          [propertyA, propertyB] = [a.lastName, b.lastName];
          break;  
        case 'mobileNumber':
          [propertyA, propertyB] = [a.mobileNumber, b.mobileNumber];
          break;
        case 'email':
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case 'address':
          [propertyA, propertyB] = [a.address, b.address];
          break;
        case 'admissionDetails':
          [propertyA, propertyB] = [a.admissionDetails, b.admissionDetails];
          break;
        case 'appointmentDate':
          [propertyA, propertyB] = [a.appointmentDate, b.appointmentDate];
          break;    
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}

