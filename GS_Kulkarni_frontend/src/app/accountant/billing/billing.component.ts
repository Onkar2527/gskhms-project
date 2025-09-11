import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
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
} from '../../shared';
import { NgClass, DatePipe, CommonModule, formatDate } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_DATE_LOCALE, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfigService } from '../../config';
import { MatMenuModule } from '@angular/material/menu';
import { BillingService } from '../../admin/service/billing.service';
import { Billing } from '../../admin/model/billing.model';
import { PrintBillComponent } from '../print-bill/print-bill.component';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  standalone: true,
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
  imports: [
    BreadcrumbComponent,
    MatButtonModule,
    MatTooltipModule,
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
    MatDatepickerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    CommonModule,
    SharedModule,
  ],
})
export class BillingComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
    displayedColumns = [
      // 'select',
      // 'id',
      'documentNumber',
      'billingDate',
      'patientUHIDNumber',
      'patientName',
      'mobileNumber',
      // 'doctorName',
      // 'address',
      'paidAmount',
      // 'taxableAmount',
      // 'totalTax',
      'balanceAmount',
      'grandTotal',
      'billingStatus',
      'createdBy',
      'actions',
     ];

     exampleDatabase?: BillingService;
     dataSource!: ExampleDataSource;
     selection = new SelectionModel<Billing>(true, []);
     index!: number;
     hospitalId!: number;
     id: any;
     startDate: Date = new Date();
     endDate: Date = new Date();
     
     constructor(
       public httpClient: HttpClient,
       public dialog: MatDialog,
       private snackBar: MatSnackBar,
       public config: ConfigService,
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
  
  printBill(row: Billing) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(PrintBillComponent, {
      data: {
        bill: row
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    })
  }

   public loadData() {
    this.sort.active = 'billingDate';
    this.sort.direction = 'desc';
     this.exampleDatabase = new BillingService(this.httpClient, this.config);
     this.dataSource = new ExampleDataSource(
       this.exampleDatabase ,
       this.paginator,
       this.sort,
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
        // 'id':x.id,
        'Document Number':x.documentNumber,
        'Billing Date': this.datepipe.transform(x.billingDate, 'MMM d, y, h:mm:ss a')?.toString(),
        'UHID Number': x.patientUHIDNumber,
        'Patient Name': x.patientName,
        'Mobile Number': x.mobileNumber,
        // 'doctorName':x.doctorName,
        // 'address': x.address,
        'Paid Amount':x.paidAmount,
        'Grand Total':x.grandTotal,          
        'Balance Amount':x.balanceAmount,
        'Billing Status':x.billingStatus,
        'Created By':x.createdBy,
      }));
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  exportPDF() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
    this.dataSource.filteredData.map((x) => ({
      // 'id':x.id,
      'Document Number':x.documentNumber,
      'Billing Date': this.datepipe.transform(x.billingDate, 'MMM d, y, h:mm:ss a')?.toString(),
      'UHID Number': x.patientUHIDNumber,
      'Patient Name': x.patientName,
      'Mobile Number': x.mobileNumber,
      // 'doctorName':x.doctorName,
      // 'address': x.address,
      'Paid Amount':x.paidAmount,
      'Grand Total':x.grandTotal,          
      'Balance Amount':x.balanceAmount,
      'Billing Status':x.billingStatus,
      'Created By':x.createdBy,
    }));
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    TableExportUtil.exportToPDF(exportData, 'Bills For Dates: '+formatDate(this.startDate, format, locale)+' to '+formatDate(this.endDate, format, locale));
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

export class ExampleDataSource extends DataSource<Billing> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Billing[] = [];
  renderedData: Billing[] = [];
  constructor(
    public exampleDatabase: BillingService,
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
  connect(): Observable<Billing[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getBills(this.startDate, this.endDate);
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((billing: Billing) => {
            const searchStr = (
              billing.id +
              billing.documentNumber +
              billing.billingDate +
              billing.mobileNumber +
              billing.paidAmount +
              billing.taxableAmount +
              billing.totalTax +
              billing.grandTotal +
              billing.balanceAmount
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
  sortData(data: Billing[]): Billing[] {
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
        case 'documentNumber':
          [propertyA, propertyB] = [a.documentNumber, b.documentNumber];
          break;
        case 'billingDate':
          [propertyA, propertyB] = [a.billingDate, b.billingDate];
          break;
        case 'mobileNumber':
          [propertyA, propertyB] = [a.mobileNumber, b.mobileNumber];
          break;
        case 'paidAmount':
          [propertyA, propertyB] = [a.paidAmount, b.paidAmount];
          break;
        case 'taxableAmount':
          [propertyA, propertyB] = [a.taxableAmount, b.taxableAmount];
          break;
        case 'totalTax':
          [propertyA, propertyB] = [a.totalTax, b.totalTax];
          break;
        case 'grandTotal':
          [propertyA, propertyB] = [a.grandTotal, b.grandTotal];
          break;
        case 'balanceAmount':
          [propertyA, propertyB] = [a.balanceAmount, b.balanceAmount];
          break;
        case 'patientUHIDNumber':
          [propertyA, propertyB] = [a.patientUHIDNumber, b.patientUHIDNumber];
          break;
        case 'patientName':
          [propertyA, propertyB] = [a.patientName, b.patientName];
          break;
        case 'mobileNumber':
          [propertyA, propertyB] = [a.mobileNumber, b.mobileNumber];
          break;
        case 'doctorName':
          [propertyA, propertyB] = [a.doctorName, b.doctorName];
          break;
        case 'address':
          [propertyA, propertyB] = [a.address, b.address];
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
