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
import { SelectionModel } from '@angular/cdk/collections';
import { Direction } from '@angular/cdk/bidi';
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from '../../../shared';
import { NgClass, DatePipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '../../../shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { ConfigService } from '../../../config';
import { HospitalService } from '../../service/hospital.service';
import { Hospital } from '../../model/hospital.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hospital-list',
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.scss'],
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
export class HospitalListComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
   // 'select',
   'id',
   'name',
   'hospitalCode',
   'regNo',
   'licNo',
   'mobileNumber',
   'email',
   'address',
   'status',
   'actions'
  ];
  exampleDatabase?: HospitalService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Hospital>(true, []);
  index!: number;
  hospitalId!: number;
  hospitalList!: Hospital;
  id: any;
  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public config: ConfigService,
    private router: Router
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

  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.router.navigate(['/admin/hospital/add-hospital'], { queryParams: { id: -1 } });
    // const dialogRef = this.dialog.open(FormDialogComponent, {
    //   data: {
    //     bankList: this.bankList,
    //     action: 'add',
    //   },
    //   direction: tempDirection,
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 1) {
    //     this.refresh();
    //     this.refreshTable();
    //     this.showNotification(
    //       'snackbar-success',
    //       'Add Record Successfully...!!!',
    //       'bottom',
    //       'center'
    //     );
    //   }
    // });
  }
  editCall(row: Hospital) {
    this.id = row.id;
    console.log("update hospital", this.id);
    let tempDirection: Direction;
    this.router.navigate(['/admin/hospital/add-hospital'], { queryParams: { id: this.id } });

    // const dialogRef = this.dialog.open(FormDialogComponent, {
    //   data: {
    //     bankList: row,
    //     action: 'edit',
    //   },
    //   direction: tempDirection,
    // });
    // this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 1) {
    //     // When using an edit things are little different, firstly we find record inside DataService by id
    //     const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
    //       (x) => x.bankId === this.bankId
    //     );
    //     // Then you update that record using data from dialogData (values you enetered)
    //     if (foundIndex != null && this.exampleDatabase) {
    //       this.refresh();
    //       this.refreshTable();
    //       this.showNotification(
    //         'black',
    //         'Edit Record Successfully...!!!',
    //         'bottom',
    //         'center'
    //       );
    //     }
    //   }
    // });
  }
  
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

   public loadData() {
     this.exampleDatabase = new HospitalService(this.httpClient, this.config);
     this.dataSource = new ExampleDataSource(
       this.exampleDatabase ,
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
        Id:x.id,
        Name:x.name,
        'Hospital Code':x.hospitalCode,
        'Registration Number':x.regNo,
        'License Number':x.licNo,
        'Phone Number':x.mobileNumber,
         Email:x.email,
         Address:x.address,
         Status : x.status,
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

export class ExampleDataSource extends DataSource<Hospital> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Hospital[] = [];
  renderedData: Hospital[] = [];
  constructor(
    public exampleDatabase: HospitalService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Hospital[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getHospitalList();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((hospitalList: Hospital) => {
            const searchStr = (
              hospitalList.id +
              hospitalList.name +
              hospitalList.hospitalCode +
              hospitalList.regNo +
              hospitalList.licNo +
              hospitalList.mobileNumber +
              hospitalList.email +
              hospitalList.address +
              hospitalList.status 
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
  sortData(data: Hospital[]): Hospital[] {
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
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case 'hospitalCode':
          [propertyA, propertyB] = [a.hospitalCode, b.hospitalCode];
          break;
        case 'regNo':
          [propertyA, propertyB] = [a.regNo, b.regNo];
          break;
        case 'licNo':
          [propertyA, propertyB] = [a.licNo, b.licNo];
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
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
