import { Direction } from '@angular/cdk/bidi';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfigService } from '@config';
import { TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter } from '@shared';
import { SharedModule } from '@shared/shared.module';
import { BillingClass } from 'app/admin/model/billing-class.model';

import { Route } from 'app/admin/model/route.model';
import { MasterService } from 'app/admin/service/master.service';
import { BehaviorSubject, Observable, fromEvent, map, merge } from 'rxjs';

@Component({
  selector: 'app-billing-class-list',
  templateUrl: './billing-class-list.component.html',
  styleUrl: './billing-class-list.component.scss',
  standalone: true,
  imports: [
   SharedModule
  ],
})
export class BillingClassListComponent extends UnsubscribeOnDestroyAdapter
implements OnInit {
displayedColumns = [
 // 'select',
 'id',
 'name',
 'chargePerDay'
];
exampleDatabase?: MasterService;
dataSource!: ExampleDataSource;
selection = new SelectionModel<BillingClass>(true, []);
index!: number;
RouteList!: Route;
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
  this.router.navigateByUrl('/admin/master/add-billing-class', { state: { billingClassData: { id: 0} } });
}
editCall(row: BillingClass) {
  
  this.id = row.id;
  console.log("update Route", this.id);
  let tempDirection: Direction;
  this.router.navigateByUrl('/admin/master/add-billing-class', {state: {billingClassData: row}});
}

private refreshTable() {
  this.paginator._changePageSize(this.paginator.pageSize);
}

 public loadData() {
   this.exampleDatabase = new MasterService(this.httpClient, this.config);
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
      'id':x.id,
      'name': x.name
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

export class ExampleDataSource extends DataSource<BillingClass> {
filterChange = new BehaviorSubject('');
get filter(): string {
  return this.filterChange.value;
}
set filter(filter: string) {
  this.filterChange.next(filter);
}
filteredData: BillingClass[] = [];
renderedData: BillingClass[] = [];
constructor(
  public exampleDatabase: MasterService,
  public paginator: MatPaginator,
  public _sort: MatSort
) {
  super();
  // Reset to the first page when the user changes the filter.
  this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
}
/** Connect function called by the table to retrieve one stream containing the data to render. */
connect(): Observable<BillingClass[]> {
  // Listen for any changes in the base data, sorting, filtering, or pagination
  const displayDataChanges = [
    this.exampleDatabase.dataChange,
    this._sort.sortChange,
    this.filterChange,
    this.paginator.page,
  ];
  this.exampleDatabase.getBillingClassList({});
  return merge(...displayDataChanges).pipe(
    map(() => {
      // Filter data
      this.filteredData = this.exampleDatabase.data
        .slice()
        .filter((routeList: BillingClass) => {
          const searchStr = (
            routeList.id +
            routeList.name
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
sortData(data: BillingClass[]): BillingClass[] {
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
    }
    const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
    const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
    return (
      (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
    );
  });
}
}
