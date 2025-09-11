import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Direction } from '@angular/cdk/bidi';
import {
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { NgClass, DatePipe, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { RegistrationService } from 'app/lab/service/registration.service';
import { Registration } from 'app/lab/model/registration.model';
import { ConfigService } from 'app/admin/employees/allemployees/config.service';
import { MatMenuModule } from '@angular/material/menu';
import { GenerateReportComponent } from '../registration-list/dialogs/generate-report/generate-report.component';
import { PrintLabReportComponent } from '../registration-list/print-lab-report/print-lab-report.component';
import { FormDialogComponent } from '../registration-list/dialogs/form-dialog/form-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-sample-collected-list',
  templateUrl: './sample-collected-list.component.html',
  styleUrls: ['./sample-collected-list.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
  standalone: true,
  imports: [
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
    MatMenuModule,
    CommonModule,
    MatDatepickerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class SampleCollectedListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    'labNumber',
    'name',
    'gender',
    'date',
    'mobile',
    'dob',
    'paymentStatus',
    'status',
    'actions',
  ];
  exampleDatabase?: RegistrationService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Registration>(true, []);
  index?: number;
  id?: number;
  appointment?: Registration | null;
  sortType = 'multi';
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public registrationService: RegistrationService,
    private snackBar: MatSnackBar,
     private config: ConfigService,
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
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource?.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index = this.dataSource?.renderedData.findIndex((d) => d === item);
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      if (index !== undefined) {
        if (this.exampleDatabase) {
          this.exampleDatabase.dataChange.value.splice(index, 1);
        }
        this.refreshTable();
        this.selection = new SelectionModel<Registration>(true, []);
      }
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }

  editCall(row: Registration,called:any='update') {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        registration: row,
        action: called,
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {    
      this.refresh();
    });
  }

  updateReport(row: Registration,called:any='update') {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(GenerateReportComponent, {
      data: {
        registration: row,
        action: called,
      },
      direction: tempDirection,
      height: '100%',
      width: '100%',
       maxWidth: "100%",
      maxHeight: "100%"
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {    
      this.refresh();
    });
  }

  printLabReport(row:any){
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(PrintLabReportComponent, {
      data: {
        id:row.id,
        appoinment:row
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    });
  }
  
  private refreshTable() {
    this.paginator?._changePageSize(this.paginator.pageSize);
  }
  
  public loadData() {
    this.exampleDatabase = new RegistrationService(this.httpClient,this.config);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort, 
      this.startDate,
      this.endDate
    );
    fromEvent(this.filter?.nativeElement, 'keyup').subscribe(() => {
      if (!this.dataSource) {
        return;
      }
      this.dataSource.filter = this.filter?.nativeElement.value;
    });
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

export class ExampleDataSource extends DataSource<Registration> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Registration[] = [];
  renderedData: Registration[] = [];
  constructor(
    public exampleDatabase: RegistrationService,
    public paginator: MatPaginator,
    public _sort: MatSort,
    public startDate: Date,
    public endDate: Date
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Registration[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllRegistration({type:'T', status: 'Sample Collected', registrationStartDate: this.startDate, registrationEndDate: this.endDate});
    return merge(...displayDataChanges).pipe(
      map(() => {
          this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((registration: Registration) => {
            const searchStr = (
              registration.id +
              registration.email +
              registration.firstName +
              registration.lastName +
              registration.mobileNumber +
              registration.gender +
              registration.labNumber +
              registration.registrationDate +
              registration.sampleCollected + 
              registration.reportGenerated
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
  sortData(data: Registration[]): Registration[] {
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
          [propertyA, propertyB] = [a.firstName, b.firstName];
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
