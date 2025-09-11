import { Direction } from '@angular/cdk/bidi';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Doctors } from './doctors.model';
import { DataSource } from '@angular/cdk/collections';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { SelectionModel } from '@angular/cdk/collections';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '@shared';
import { formatDate, NgClass, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { EmployeeService } from 'app/admin/employees/allemployees/employees.service';
import { Employee } from 'app/admin/employees/allemployees/employees.model';
import { ConfigService } from '@config';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { Designation } from '../../model/designation.model';
import { Router } from '@angular/router';
import { Doctor } from '../doctor.model';
@Component({
  selector: 'app-alldoctors',
  templateUrl: './alldoctors.component.html',
  styleUrls: ['./alldoctors.component.scss'],
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
export class AlldoctorsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
    departments$: any;
    designation$: any;
    specialization$: any;
  displayedColumns = [
    // 'select',
    'img',
    'firstName',
    // 'designation' ,
    // 'doctorType' ,
    'specialization',
    'mobileNumber',
    'emailId',
    'dateOfJoining',
    'gender',
    'actions',
  ];
 
  exampleDatabase?: EmployeeService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Employee>(true, []);
  index?: number;
  id?: number;
  doctors?: Employee;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public doctorsService: EmployeeService,
    private snackBar: MatSnackBar,
    public config: ConfigService,
    public dropDownService: DropdownService,
    private router: Router,
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
    this.getDesignation();
    this.getSpecialization();
    this.getDepartments();
  }
  
  getDepartments() {
    let data: any;
    this.dropDownService.departmentCombo(data).subscribe((result: any) => {
      this.departments$ = result.data;
      console.log("department combo ", this.departments$)
    });
  }

  getDesignation() {
    const data = new Designation();
    data.status = 'Active';
    this.dropDownService.designationCombo(data).subscribe((result: any) => {
      this.designation$ = result.data;
      console.log("designation combo ", this.designation$)
    });
  }

  getSpecialization() {
    const data = new Designation();
    data.status = 'Active';
    this.dropDownService.specializationCombo(data).subscribe((result: any) => {
      this.specialization$ = result.data;
      console.log("specialization combo ", this.specialization$)
    });
  }

  refresh() {
    this.loadData();
  }

  addServiceRates(row: Doctors) {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
        doctors: row,
        action: 'add',
      },
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataServicex
        this.exampleDatabase?.dataChange.value.unshift(
          this.doctorsService.getDialogData()
        );
        this.refreshTable();
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.router.navigate(['/admin/doctors/add-doctor'], { queryParams: { id: -1 } });
  }

  editCall(row: Doctor) {
    this.router.navigate(['/admin/doctors/add-doctor'], { queryParams: { userId: row.employeeId } });
  }

  deleteItem(row: Doctors) {
    this.id = row.id;
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
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.employeeId === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
          this.showNotification(
            'snackbar-danger',
            'Delete Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }

  private refreshTable() {
    this.paginator?._changePageSize(this.paginator?.pageSize);
  }
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    return numSelected === numRows;
  }

  public loadData() {
    this.exampleDatabase = new EmployeeService(this.httpClient, this.config);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
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
        Name: x.firstName,
        Email: x.emailId,
        Department: x.department,
       'Joining Date': formatDate(new Date(x.dateOfJoining), 'yyyy-MM-dd', 'en') || '',
        Specialization: x.specializationId,
        Designation: x.designationId,
        Gender :x.gender,
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
    this.exampleDatabase.getAllDoctors();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((doctors: Employee) => {
            const searchStr = (
              doctors.firstName +
              doctors.department +
              doctors.specializationId +
              doctors.designationId+
              doctors.emailId +
              doctors.dateOfJoining +
              doctors.gender+
              doctors.mobileNumber
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
        case 'firstName':
          [propertyA, propertyB] = [a.firstName, b.firstName];
          break;
        case 'emailId':
          [propertyA, propertyB] = [a.emailId, b.emailId];
          break;
        case 'dateOfJoining':
          [propertyA, propertyB] = [a.dateOfJoining, b.dateOfJoining];
          break;
        case 'department':
          [propertyA, propertyB] = [a.department, b.department];
          break;
          case 'gender':
          [propertyA, propertyB] = [a.gender, b.gender];
          break;
        case 'mobileNumber':
          [propertyA, propertyB] = [a.mobileNumber, b.mobileNumber];
          break;
        case 'specializationId':
         [propertyA, propertyB] = [a.specializationId, b.specializationId];
          break;
        case 'designationId':
         [propertyA, propertyB] = [a.designationId, b.designationId];
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


   
