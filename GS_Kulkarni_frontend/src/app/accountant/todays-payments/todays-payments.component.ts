import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { Hospital } from '../../../app/admin/model/hospital.model';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfigService } from '../../config';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '../../shared';
import { fromEvent, BehaviorSubject, Observable, merge, map } from 'rxjs';
import { NgClass, DatePipe, formatDate } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '../../shared/components/feather-icons/feather-icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { Payment } from './Payment.model';
import { PaymentsService } from '../payments.service';
import { Direction } from '@angular/cdk/bidi';
import { PrintPaymentReceiptComponent } from '../print-payment-receipt/print-payment-receipt.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-todays-payments',
  standalone: true,
  providers: [{
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: {
      subscriptSizing: 'dynamic'
    }
  },{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
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
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,      
  ],
  templateUrl: './todays-payments.component.html',
  styleUrl: './todays-payments.component.scss'
})
export class TodaysPaymentsComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  displayedColumns = [
    // 'select',
    // 'id',
    // 'documentNumber',
    'uhidnumber',
    // 'appointmentNumber',
    'name',
    // 'lastName',
    'mobileNumber',
    'serviceName',
    'amount',
    'paymentStatus',
    'createdBy',
    'paymentMode',
    // 'transactionNumber',
    'actions'
  ];

  exampleDatabase?: PaymentsService;
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
    public config: ConfigService,
    public paymentsService: PaymentsService,
    private _snackBar: MatSnackBar,
    private router: Router,
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

  printPayment(row: Payment) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(PrintPaymentReceiptComponent, {
      data: {
        payment: row
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  editPayment(row: Payment) {
    this.router.navigate(['/accountant/payment'], { queryParams: { payment : JSON.stringify(row) } });
  }

//   editPayment(row: Payment) {
//   this.router.navigate(['/accountant/payment'], {
//     queryParams: {
//       appointment: JSON.stringify(row.appointmentId),
//       payment: JSON.stringify(row)
//     }
//   });
// }

  public loadData() {
    this.sort.active = 'paymentDate';
    this.sort.direction = 'desc';
    this.exampleDatabase = new PaymentsService(this.httpClient, this.config);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
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
      // 'id': x.id,
      'Document Number': x.documentNumber,
      'UHID': x.uhidnumber,
      'Appointment Number': x.appointmentNumber,
      'Name': x.firstName+ ' '+x.lastName,
      'Mobile Number': x.mobileNumber,
      // 'serviceName': x.description,
      'Amount': x.amount,
      'Payment Status': x.paymentStatus,
      'Created By': x.createdBy,
      'Payment Mode': x.paymentMode,
      'Transaction Number': x.transactionNumber,
    }));
    exportData.push({
      'Document Number': '',
      'UHID': '',
      'Appointment Number': '',
      'Name': '',
      'Mobile Number': 'Total:',
      'Amount': this.calculation(),
      'Payment Status': '',
      'Created By': '',
    });
    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  exportPDF() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        // 'id': x.id,
        'Document Number': x.documentNumber,
        'UHID': x.uhidnumber,
        'Appointment Number': x.appointmentNumber,
        'Name': x.firstName+' '+x.lastName,
        'Mobile Number': x.mobileNumber,
        // 'serviceName': x.description,
        'Amount': x.amount,
        'Payment Status': x.paymentStatus,
        'Created By': x.createdBy,
        'Payment Mode': x.paymentMode,
        'Transaction Number': x.transactionNumber,
      }));
      exportData.push({
        'Document Number': '',
        'UHID': '',
        'Appointment Number': '',
        'Name': '',
        'Mobile Number': 'Total:',
        'Amount': this.calculationfilteredData(),
        'Payment Status': '',
        'Created By': ''
      });
      const format = 'dd/MM/yyyy';
      const locale = 'en-US';
    TableExportUtil.exportToPDF(exportData, 'Payments For Dates: '+formatDate(this.startDate, format, locale)+' to '+formatDate(this.endDate, format, locale));
  }

  calculationfilteredData() {
    let sum: number = 0;
    if (this.dataSource)
      for (let row of this.dataSource.filteredData) {
        if (row.id != 0) sum += row.amount;
      }
    return sum;
  }

  calculation() {
    let sum: number = 0;
    if (this.dataSource)
      for (let row of this.dataSource.renderedData) {
        if (row.id != 0) sum += row.amount;
      }
    return sum;
  }
}

export class ExampleDataSource extends DataSource<Payment> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Payment[] = [];
  renderedData: Payment[] = [];
  constructor(
    public exampleDatabase: PaymentsService,
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
  connect(): Observable<Payment[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];

    this.exampleDatabase.getTodaysPayments(this.startDate, this.endDate);
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((payment: Payment) => {
            const searchStr = (
              payment.id +
              payment.firstName +
              payment.lastName +
              payment.mobileNumber +
              payment.documentNumber +
              payment.uhidnumber +
              payment.appointmentNumber +
              // payment.serviceName +
              payment.paymentStatus +
              payment.createdBy +
              payment.paymentMode +
              payment.transactionNumber
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
  sortData(data: Payment[]): Payment[] {
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
        case 'firstName':
          [propertyA, propertyB] = [a.firstName, b.firstName];
          break;
        case 'lastName':
          [propertyA, propertyB] = [a.lastName, b.lastName];
          break;
        case 'mobileNumber':
          [propertyA, propertyB] = [a.mobileNumber, b.mobileNumber];
          break;
        case 'documentNumber':
          [propertyA, propertyB] = [a.documentNumber, b.documentNumber];
          break;
        case 'uhidnumber':
          [propertyA, propertyB] = [a.uhidnumber, b.uhidnumber];
          break;
        case 'appointmentNumber':
          [propertyA, propertyB] = [a.appointmentNumber, b.appointmentNumber];
          break;
        case 'serviceName':
          [propertyA, propertyB] = [a.serviceName, b.serviceName];
          break;
        case 'paymentStatus':
          [propertyA, propertyB] = [a.paymentStatus, b.paymentStatus];
          break;
        case 'paymentMode':
          [propertyA, propertyB] = [a.paymentMode, b.paymentMode];
          break;
        case 'transactionNumber':
          [propertyA, propertyB] = [a.transactionNumber, b.transactionNumber];
          break;
        case 'createdBy':  
          [propertyA, propertyB] = [a.createdBy, b.createdBy];
          break;
        case 'paymentDate':
          [propertyA, propertyB] = [a.paymentDate, b.paymentDate];
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
