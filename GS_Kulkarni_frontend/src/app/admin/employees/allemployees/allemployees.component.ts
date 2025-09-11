import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from './employees.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Employee } from './employees.model';
import { DataSource } from '@angular/cdk/collections';
import { DeleteDialogComponent } from './dialog/delete/delete.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { Direction } from '@angular/cdk/bidi';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '../../../shared';
import { formatDate, NgClass, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '../../../shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ConfigService } from '../../../config';
import { Router } from '@angular/router';
import { AddFileUploadComponent } from './dialog/add-file-upload/add-file-upload.component';
import { Designation } from 'app/admin/model/designation.model';
import { DropdownService } from 'app/admin/service/dropdown.service';
@Component({
  selector: 'app-allemployees',
  templateUrl: './allemployees.component.html',
  styleUrls: ['./allemployees.component.scss'],
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
  ],
})
export class AllEmployeesComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {

  displayedColumns = [
   // 'select',
    'img',
    'name',
    'userType',
    'designation',
    'specialization',
    'mobile',
    'emailId',
    'dateOfJoining',
    'address',
    'actions',
  ];
  exampleDatabase!: EmployeeService| null;
  dataSourceExample!: ExampleDataSource;
  dataSource: any;
  selection = new SelectionModel<Employee>(true, []);
  index!: number;
  userId!: number;
  employee!: Employee | null;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    public config: ConfigService,
    private router: Router,
    public datepipe: DatePipe
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true })
  filter!: ElementRef;
  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }
  
  addNew() {
    this.router.navigate(['/admin/employees/add-employee'], { queryParams: { userId: -1 } });
  }

  upload(row: { id: number }) {
    this.userId = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(AddFileUploadComponent, {
      data: {
        employee: row,
        action: 'upload',
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refresh();
      }
    });
  }

  editCall(row: Employee) {
    this.userId = row.employeeId;
    this.router.navigate(['/admin/employees/add-employee'], { queryParams: { userId: this.userId } });
  }

  deleteItem(row: { id: number }) {
    this.userId = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: row,
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.refresh();
      }
    });
  }

  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceExample?.renderedData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSourceExample?.renderedData.forEach((row) =>
        this.selection.select(row)
      );
  }

  removeSelectedRows() {
    const totalSelect = this.selection.selected.length;
    this.selection.selected.forEach((item) => {
      const index = this.dataSourceExample?.renderedData.findIndex((d) => d === item);
      // console.log(this.dataSource.renderedData.findIndex((d) => d === item));
      if (index !== undefined) {
        if (this.exampleDatabase) {
          this.exampleDatabase.dataChange.value.splice(index, 1);
        }
        this.refreshTable();
        this.selection = new SelectionModel<Employee>(true, []);
      }
    });
    this.showNotification(
      'snackbar-danger',
      totalSelect + ' Record Delete Successfully...!!!',
      'bottom',
      'center'
    );
  }

  public loadData() {
    this.exampleDatabase = new EmployeeService(this.httpClient, this.config);
    this.dataSourceExample = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
      () => {
        if (!this.dataSourceExample) {
          return;
        }
        this.dataSourceExample.filter = this.filter.nativeElement.value;
      }
    );
  }

  // export table data in excel file
  exportExcel() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSourceExample.filteredData.map((x) => ({
        Name: x.firstName,
        Designation: x.designationId,
        Specialization:x.specializationId,
        'emailId': x.emailId,
        'dateOfJoining': formatDate(new Date(x.dateOfJoining), 'MMM d, y', 'en'),
        Address: x.currentAddress,
        Mobile: x.mobileNumber,
       
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

export class ExampleDataSource extends DataSource<Employee> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Employee[] = [];
  renderedData: Employee[] = [];
  constructor(
    public exampleDatabase: EmployeeService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Employee[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    const data = new Employee;
    this.exampleDatabase.getEmployeeData();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((employee: Employee) => {
            const searchStr = (
              employee.firstName +
              employee.designationId +
              employee.specializationId +
              employee.mobileNumber +
              employee.emailId +
              employee.dateOfJoining +
              employee.currentAddress
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
  sortData(data: Employee[]): Employee[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.employeeId, b.employeeId];
          break;
        case 'name':
          [propertyA, propertyB] = [a.firstName, b.firstName];
          break;
        case 'emailId':
          [propertyA, propertyB] = [a.emailId, b.emailId];
          break;
        case 'dateOfJoining':
          [propertyA, propertyB] = [a.dateOfJoining, b.dateOfJoining];
          break;
        case 'address':
          [propertyA, propertyB] = [a.currentAddress, b.currentAddress];
          break;
        case 'mobile':
          [propertyA, propertyB] = [a.mobileNumber, b.mobileNumber];
          break;
        case 'designationId':
          [propertyA, propertyB] = [a.designationId, b.designationId];
          break;
        case 'specializationId':
          [propertyA, propertyB] = [a.specializationId, b.specializationId];
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
