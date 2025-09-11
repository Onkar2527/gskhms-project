import { NgClass, DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { SharedModule } from '@shared/shared.module';
import { InitialClinicalAssessmentService } from '../services/initial-clinical-assessment.service';
import { InitialClinicalAssessment } from '../model/initial-clinical-assessment.model';
import { Direction } from '@angular/cdk/bidi';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { ConfigService } from '@config';
import { LoginService } from 'app/authentication/login.service';
import { FormComponent } from 'app/contacts/form/form.component';
import { AttentAppoinmentComponent } from 'app/doctor/opd/appointments/attent-appoinment/attent-appoinment.component';
import { PrintPrescriptionComponent } from 'app/doctor/opd/appointments/print-prescription/print-prescription.component';
import { fromEvent, BehaviorSubject, Observable, merge, map } from 'rxjs';
import { Router } from '@angular/router';
import { Appointment } from 'app/admin/appointment/viewappointment/appointment.model';

@Component({
  selector: 'app-initial-clinical-assessment-list',
  standalone: true,
  imports: [  
    BreadcrumbComponent,
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
    SharedModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
  templateUrl: './initial-clinical-assessment-list.component.html',
  styleUrl: './initial-clinical-assessment-list.component.scss'
})
export class InitialClinicalAssessmentListComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  filterToggle = false;
  displayedColumns = [
    // 'id',
    'name',
    'dateTime',
    'mobile',
    'address',
    'chiefComplaint',
    'admitStatus',
    'actions',
  ];
  exampleDatabase?: InitialClinicalAssessmentService;
  selection = new SelectionModel<InitialClinicalAssessment>(true, []);
  dataSource!: ExampleDataSource;
  id?: number;
  appointments?: InitialClinicalAssessment;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public appointmentsService: InitialClinicalAssessmentService,
    private snackBar: MatSnackBar,
    public config: ConfigService,
    public loginService:LoginService,
    public datepipe: DatePipe,
    private router: Router,
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }
  
  printPrescription(row:any){
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(PrintPrescriptionComponent, {
      data: {
        id:row.id,
        appoinment:row
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    });
  }
  
  editCall(row: InitialClinicalAssessment) {
    this.router.navigate(['/doctor/initial-clinical-assessment'], { queryParams: { assessment : JSON.stringify(row) } });
  }

  admit(row: InitialClinicalAssessment){
    this.router.navigate(['/nurse/bed-management'], { queryParams: { assessment : JSON.stringify(row) } });
  }

  package(row: Appointment){
    this.router.navigate(['/reception/package-management'], { queryParams: { assessment : JSON.stringify(row) } });
  }

  detailsCall(row: InitialClinicalAssessment) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(FormComponent, {
      data: {
        appointments: row,
        action: 'details',
      },
      direction: tempDirection,
      height: '70%',
      width: '35%',
    });
  }

  toggleStar(row: InitialClinicalAssessment) {
  }
  
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index: number = this.dataSource.renderedData.findIndex(
        (d) => d === item
      );
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      this.exampleDatabase?.dataChange.value.splice(index, 1);
      this.refreshTable();
      this.selection = new SelectionModel<InitialClinicalAssessment>(true, []);
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }

  public loadData() {
    this.exampleDatabase = new InitialClinicalAssessmentService(this.httpClient,this.config);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort,
      this.loginService,
      this.startDate,
      this.endDate
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
        'Patient Name': x.patientDetails.firstName + x.patientDetails.lastName,
        'Date & Time':
          formatDate(new Date(x.admissionDate), 'yyyy-MM-dd', 'en') || '',
        Mobile: x.patientDetails.mobileNumber,
        Disease: '',
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
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

export class ExampleDataSource extends DataSource<InitialClinicalAssessment> {
  hospitalId:any;
  userId:any;
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: InitialClinicalAssessment[] = [];
  renderedData: InitialClinicalAssessment[] = [];
  constructor(
    public exampleDatabase: InitialClinicalAssessmentService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    private loginService:LoginService,
    public startDate: Date,
    public endDate: Date,
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<InitialClinicalAssessment[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];

    this.loginService.currentLoggedInUser.subscribe((user:any)=>{
        if(user!=undefined){
        this.hospitalId=user.hospitalId;
        this.userId=user.id;
        }
      })
    const data1 = {
      hospitalId:this.hospitalId,
      doctorId:this.userId,
      statuses: [
        "Confirmed"
      ],
      appointmentStartDate: this.startDate,
      appointmentEndDate: this.endDate
    }

    this.exampleDatabase.getAssessments();
    return merge(...displayDataChanges).pipe(
      map(() => {
        
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((appointments: InitialClinicalAssessment) => {
            const searchStr = (
              appointments.patientDetails?.firstName +
              appointments.patientDetails?.lastName +
              appointments.patientDetails?.mobileNumber 
            )?.toLowerCase();
            return searchStr.indexOf(this.filter?.toLowerCase()) !== -1;
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
  sortData(data: InitialClinicalAssessment[]): InitialClinicalAssessment[] {
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
        case 'name':
          [propertyA, propertyB] = [a.patientDetails?.firstName+a.patientDetails?.lastName, b.patientDetails?.firstName+a.patientDetails?.lastName];
          break;
        case 'address':
          [propertyA, propertyB] = [a.patientDetails?.address, b.patientDetails?.address];
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
