
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
import { Route } from 'app/admin/model/route.model';
import { GTemplate } from 'app/admin/model/gtemplate.model';

import { MasterService } from 'app/admin/service/master.service';
import { BehaviorSubject, Observable, fromEvent, map, merge } from 'rxjs';
import { GNoteTemplate } from 'app/admin/model/gnoteTemplate.model';

@Component({
  selector: 'app-gynecology_list',
  templateUrl: './gynecology_list.component.html',
  styleUrl: './gynecology_list.component.scss',
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
export class gynecologycomponent extends UnsubscribeOnDestroyAdapter
implements OnInit {
displayedColumns = [
 // 'select',
 'id',
 'operation_name',
 'pre_op',
 'procedure_op',
 'post_op',
 'addition_description',
 'treatment'
];
exampleDatabase?: MasterService;
dataSource!: ExampleDataSource;
selection = new SelectionModel<GTemplate>(true, []);
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
  this.router.navigateByUrl('/admin/master/add-note-gtemplate', { state: { templateData: { id: 0} } });
}
editCall(row: GNoteTemplate) {
  
  this.id = row.id;
  console.log("update Route", this.id);
  let tempDirection: Direction;
  this.router.navigateByUrl('/admin/master/add-note-gtemplate', {state: {gNoteTemplateData: row}});
  console.log("update Route", {GNoteTemplateData: row});
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
      'name': x.operation_name,
      
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

export class ExampleDataSource extends DataSource<GTemplate> {
filterChange = new BehaviorSubject('');
get filter(): string {
  return this.filterChange.value;
}
set filter(filter: string) {
  this.filterChange.next(filter);
}
filteredData: GTemplate[] = [];
renderedData: GTemplate[] = [];
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
connect(): Observable<GTemplate[]> {
  // Listen for any changes in the base data, sorting, filtering, or pagination
  const displayDataChanges = [
    this.exampleDatabase.dataChange,
    this._sort.sortChange,
    this.filterChange,
    this.paginator.page,
  ];
  this.exampleDatabase.getGTemplateList({});
  return merge(...displayDataChanges).pipe(
    map(() => {
      // Filter data
      this.filteredData = this.exampleDatabase.data
        .slice()
        .filter((routeList: GTemplate) => {
          const searchStr = (
            routeList.id +
            routeList.operation_name+
            routeList.pre_op+
            routeList.procedure_op+
            routeList.post_op+
            routeList.addition_description+
            routeList.treatment
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
sortData(data: GTemplate[]): GTemplate[] {
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
      case 'operation_name':
        [propertyA, propertyB] = [a.operation_name, b.operation_name];
        break;
      case 'pre_op':
        [propertyA, propertyB] = [a.pre_op, b.pre_op];
        break;
      case 'procedure_op':
        [propertyA, propertyB] = [a.procedure_op, b.procedure_op];
        break;
      case 'post_op':
        [propertyA, propertyB] = [a.post_op, b.post_op];
        break;
      case 'addition_description':
        [propertyA, propertyB] = [a.addition_description, b.addition_description];
        break;
      case 'treatment':
        [propertyA, propertyB] = [a.treatment, b.treatment];
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
