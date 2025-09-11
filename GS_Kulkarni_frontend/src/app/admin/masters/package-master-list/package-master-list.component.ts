import { Direction } from '@angular/cdk/bidi';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { DatePipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ConfigService } from '@config';
import { TableElement, TableExportUtil, UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { DepartmentList } from 'app/admin/departments/department-list/department-list.model';
import { PackageMaster } from 'app/admin/model/packageMaster.model';
import { Route } from 'app/admin/model/route.model';
import { DropdownService } from 'app/admin/service/dropdown.service';

import { MasterService } from 'app/admin/service/master.service';
import { BehaviorSubject, Observable, fromEvent, map, merge } from 'rxjs';

@Component({
  selector: 'app-package-master-list',
  templateUrl: './package-master-list.component.html',
  styleUrl: './package-master-list.component.scss',
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
export class PackageMasterListComponent extends UnsubscribeOnDestroyAdapter
implements OnInit {
displayedColumns = [
 // 'select',
 'id',
 'name',
 'deptId',
 'charges'
];
exampleDatabase?: MasterService;
dataSource!: ExampleDataSource;
selection = new SelectionModel<PackageMaster>(true, []);
index!: number;
RouteList!: Route;
id: any;
// departmentList: DepartmentList[] = [];
departmentList: any[] = [];

constructor(
  public httpClient: HttpClient,
  public dialog: MatDialog,
  private snackBar: MatSnackBar,
  public config: ConfigService,
  private router: Router,
  public dropDownService: DropdownService,
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

  this.getDepartments();

}

refresh() {
  this.loadData();
}


// getDepartmentName(deptId: number): string {
//   const dept = this.departmentList.find(d => d.id === deptId);
//   return dept ? dept.name : 'Unknown';
// }
getDepartments() {
  const data = new DepartmentList();
  this.dropDownService.departmentCombo(data).subscribe((result: any) => {
    this.departmentList = result.data; // <-- assign to departmentList
    console.log("department combo", this.departmentList);
  });
}

getDepartmentName(deptId: number): string {
  console.log("deptId", deptId);
  // const deptName = this.departmentList.find(d => d.id === deptId)?.deptName;
  // console.log("deptName", deptName);
  console.log("departmentList", this.departmentList);
  const dept = this.departmentList.find(d => d.deptId === deptId);

  return dept ? dept.deptName : 'Unknown'; 
}

// getDepartmentName(deptId: number): string {
//   const dept = this.departmentList.find(d => d.id === deptId);
//   return dept ? dept.name : 'Unknown';
// }


// getServiceName(serviceId: number): string {

addNew() {
  let tempDirection: Direction;
  if (localStorage.getItem('isRtl') === 'true') {
    tempDirection = 'rtl';
  } else {
    tempDirection = 'ltr';
  }
  this.router.navigateByUrl('/admin/master/add-package-master', { state: { packageMasterData: { id: 0} } });
}
editCall(row: PackageMaster) {
  
  this.id = row.id;
  console.log("update Route", this.id);
  let tempDirection: Direction;
  this.router.navigateByUrl('/admin/master/add-package-master', {state: {packageMasterData: row}});
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

export class ExampleDataSource extends DataSource<PackageMaster> {
filterChange = new BehaviorSubject('');
get filter(): string {
  return this.filterChange.value;
}
set filter(filter: string) {
  this.filterChange.next(filter);
}
filteredData: PackageMaster[] = [];
renderedData: PackageMaster[] = [];
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
connect(): Observable<PackageMaster[]> {
  // Listen for any changes in the base data, sorting, filtering, or pagination
  const displayDataChanges = [
    this.exampleDatabase.dataChange,
    this._sort.sortChange,
    this.filterChange,
    this.paginator.page,
  ];
  this.exampleDatabase.getPackageMasterList({});
  return merge(...displayDataChanges).pipe(
    map(() => {
      // Filter data
      // this.filteredData = this.exampleDatabase.data
      //   .slice()
      //   .filter((packageMasterList: PackageMaster) => {
      //     const searchStr = (
      //       packageMasterList.id +
      //       packageMasterList.name
      //     ).toLowerCase();
      //     return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      //   });

      this.filteredData = this.exampleDatabase.data
  .slice()
  .filter((packageMasterList: PackageMaster) => {
    const id = packageMasterList.id ? packageMasterList.id.toString() : ''; // Ensure id is a string
    const name = packageMasterList.name ? packageMasterList.name.toString() : ''; // Ensure name is a string
    
    const searchStr = (id + name).toLowerCase();
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
sortData(data: PackageMaster[]): PackageMaster[] {
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
