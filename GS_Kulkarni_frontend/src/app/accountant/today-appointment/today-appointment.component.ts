import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { Hospital } from '../../../app/admin/model/hospital.model';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfigService } from '../../config';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '../../shared';
import { fromEvent, BehaviorSubject, Observable, merge, map } from 'rxjs';
import { NgClass, DatePipe, formatDate, CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-today-appointment',
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
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    CommonModule,
    SharedModule,
  ],
  templateUrl: './today-appointment.component.html',
  styleUrl: './today-appointment.component.scss'
})
export class TodayAppointmentComponent extends UnsubscribeOnDestroyAdapter
implements OnInit  {
  displayedColumns = [
    // 'select',
    // 'id',
    'name',
    'mobileNumber',
    'gender',
    'dob',
    'address',
    'status',
    'createdBy',
    'actions'
  ];

  exampleDatabase?: AppointmentsService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Hospital>(true, []);
  index!: number;
  hospitalId!: number;
  hospitalList!: Hospital;
  id: any;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public config: ConfigService,
    private router: Router,
    public appointmentsService: AppointmentsService, 
    private _snackBar: MatSnackBar,
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

  editCall(row: Appointments) {
    this.router.navigate(['/reception/appointments/book'], { queryParams: { appointment : JSON.stringify(row) } });
  }

  makePayment(row: Appointments) {
    this.router.navigate(['/accountant/payment'], { queryParams: { appointment : JSON.stringify(row) } });
  }

  cancelAppointment(row : Appointments) {
    row.status = 'Cancelled';
    
    this.appointmentsService.updateAppointments(row).subscribe((result: any) => {
      if (result['message'] == 'Data Modified Successfully') {
        this.openSnackBar(result['message']);
        this.loadData();
      } else {
        this.openSnackBar(result['message']);
      }
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  public loadData() {
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
        'Created By': x.createdBy
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
        'Created By': x.createdBy
      }));
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    TableExportUtil.exportToPDF(exportData, 'Waiting To Pay Appointments For Dates: ' + formatDate(this.startDate, format, locale) + ' to ' + formatDate(this.endDate, format, locale));
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
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
    this.exampleDatabase.getTodaysWaitingAppoinments(this.startDate, this.endDate);
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((appointments: Appointments) => {
            const searchStr = (
              appointments.id +
              appointments.firstName +
              appointments.lastName +
              appointments.mobileNumber +
              appointments.gender +
              appointments.address +
              appointments.status
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
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
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
        case 'status':
          [propertyA, propertyB] = [a.status, b.status];
          break;
        case 'createdBy':
          [propertyA, propertyB] = [a.createdBy, b.createdBy];
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
function formateDate(dob: Date): any {
  throw new Error('Function not implemented.');
}
