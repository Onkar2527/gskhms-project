import { DatePipe, formatDate, NgClass } from '@angular/common';
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
import { AppointmentsService } from '../appointments.service';
import { Appointments } from '../appointments.model';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@config';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { LoginService } from 'app/authentication/login.service';
import { BehaviorSubject, fromEvent, map, merge, Observable, take } from 'rxjs';
import { Direction } from '@angular/cdk/bidi';
import { PrintPrescriptionComponent } from 'app/doctor/ipd/print-prescription/print-prescription.component';
import { AttentAppoinmentComponent } from '../attent-appoinment/attent-appoinment.component';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-special-cases',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
  standalone: true,
  templateUrl: './special-cases.component.html',
  styleUrl: './special-cases.component.scss',
  imports: [BreadcrumbComponent,
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
    SharedModule],
})
export class SpecialCasesComponent extends UnsubscribeOnDestroyAdapter
  implements OnInit{

    filterToggle = false;
      displayedColumns = [
        'id',
        'name',
        'dateTime',
        'mobile',
        'disease',
        'status',
        'paymentStatus',
        'actions',
      ];

      exampleDatabase?: AppointmentsService;
      dataSource!: ExampleDataSource;
      selection = new SelectionModel<Appointments>(true, []);
      id?: number;
      appointments?: Appointments;
      startDate: Date = new Date();
      endDate: Date = new Date();
    
      constructor(
        public httpClient: HttpClient,
        public dialog: MatDialog,
        public appointmentsService: AppointmentsService,
        private snackBar: MatSnackBar,
        public config: ConfigService,
        public loginService:LoginService,
        public datepipe: DatePipe
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
    

  ngOnInit(): void {
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
  
    public attendAppoinment(row: Appointments){
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
      this.dialog.open(AttentAppoinmentComponent, {
        data: {
          id:row.id,
          appointments: row,
          action: 'details',
        },
        direction: tempDirection,
        height: '100%',
        width: '100%',
         maxWidth: "100%",
        maxHeight: "100%"
      });
    }
  
    detailsCall(row: Appointments) {
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
  
    toggleStar(row: Appointments) {}
  
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
        this.selection = new SelectionModel<Appointments>(true, []);
      });
      this.showNotification(
        'snackbar-danger',
        totalSelect + ' Record Delete Successfully...!!!',
        'bottom',
        'center'
      );
    }
  
    public loadData() {
      this.sort.active = 'appointmentDate';
      this.sort.direction = 'desc';
      this.exampleDatabase = new AppointmentsService(this.httpClient,this.config);
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
          'Patient Name': x.firstName + x.lastName,
          'Date & Time':
            formatDate(new Date(x.appointmentDate), 'yyyy-MM-dd', 'en') || '',
          Mobile: x.mobileNumber,
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


export class ExampleDataSource extends DataSource<Appointments> {
  hospitalId:any;
  userId:any;
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Appointments[] = [];
  renderedData: Appointments[] = [];
  constructor(
    public exampleDatabase: AppointmentsService,
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
  // connect(): Observable<Appointments[]> {
  //   // Listen for any changes in the base data, sorting, filtering, or pagination
  //   const displayDataChanges = [
  //     this.exampleDatabase.dataChange,
  //     this._sort.sortChange,
  //     this.filterChange,
  //     this.paginator.page,
  //   ];

  //   this.loginService.currentLoggedInUser.subscribe((user:any)=>
  //     {
  //       if(user!=undefined){
  //       this.hospitalId=user.hospitalId;
  //       this.userId=user.id;
  //       }
  //     })
  //   // const data1 = {
  //   //   hospitalId:this.hospitalId,
  //   //   doctorId:this.userId,
  //   //   statuses: [
  //   //     'Completed'
  //   //   ],
  //   //   appointmentStartDate: this.startDate,
  //   //   appointmentEndDate: this.endDate
  //   // }

  //   // const data1 = {
  //   //   hospitalId:this.hospitalId,
  //   //   doctorId:this.userId,
  //   //   statuses: [ 'Completed' ],
  //   //   appointmentStartDate: this.startDate,
  //   //   appointmentEndDate: this.endDate
  //   // }
    
  //   // this.exampleDatabase.getAllAppointmentss(data1);
    

  //   // this.exampleDatabase.getAllAppointmentss(data1);

  //   const data1 = {
  //     hospitalId:this.hospitalId,
  //     doctorId:this.userId,
  //     statuses: [ 'Completed' ],
  //     appointmentStartDate: this.startDate,
  //     appointmentEndDate: this.endDate
  //   }
    
  //   this.exampleDatabase.getAllAppointmentss(data1);

  //   const data = {
  //     hospitalId: this.hospitalId,
  //     doctorId: this.userId,
  //     // statuses: [ 'Completed' ],
  //     appointmentStartDate: this.startDate,
  //     appointmentEndDate: this.endDate
  //   };
    
  //   this.exampleDatabase.getSpecialCaseAppointments(data);
    



  //   return merge(...displayDataChanges).pipe(
  //     map(() => {
        
        
  //       this.filteredData = this.exampleDatabase.data
  //         .slice()
  //         .filter((appointments: Appointments) => {
  //           const searchStr = (
  //             appointments.firstName +
  //             appointments.lastName +
  //             appointments.mobileNumber 
  //           )?.toLowerCase();
  //           return searchStr.indexOf(this.filter?.toLowerCase()) !== -1;
  //         });
        
        
  //       const sortedData = this.sortData(this.filteredData.slice());
         
  //       const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  //       this.renderedData = sortedData.splice(
  //         startIndex,
  //         this.paginator.pageSize
  //       );
  //       return this.renderedData;
  //     })
  //   );
  // }


  connect(): Observable<Appointments[]> {
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
  
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    if (currentUser) {
      this.hospitalId = currentUser.hospitalId;
      this.userId = currentUser.id;
  
      const data = {
        hospitalId: this.hospitalId,
        doctorId: this.userId,
        appointmentStartDate: this.startDate,
        appointmentEndDate: this.endDate
      };
  
      // Only fetch special case appointments
      this.exampleDatabase.getSpecialCaseAppointments(data);
    }
  
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((appointments: Appointments) => {
            const searchStr = (
              (appointments.firstName ?? '') +
              (appointments.lastName ?? '') +
              (appointments.mobileNumber ?? '')
              
            ).toLowerCase();
            return searchStr.indexOf(this.filter?.toLowerCase() ?? '') !== -1;
          });
  
        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this.paginator.pageSize);
        return this.renderedData;
      })
    );
  }
  


 
  
  
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() { }
  /** Returns a sorted copy of the database data. */
  sortData(data: Appointments[]): Appointments[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string | Date= '';
      let propertyB: number | string | Date= '';
      switch (this._sort.active) {
        case 'id':
          [propertyA, propertyB] = [a.id, b.id];
          break;
        case 'name':
          [propertyA, propertyB] = [a.firstName+a.lastName, b.firstName+a.lastName];
          break;
        case 'address':
          [propertyA, propertyB] = [a.address, b.address];
          break;
        case 'appointmentDate':
          [propertyA, propertyB] = [a.appointmentDate, b.appointmentDate];
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
