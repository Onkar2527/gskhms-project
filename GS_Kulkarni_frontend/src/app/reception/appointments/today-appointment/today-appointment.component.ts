import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { Hospital } from '../../../../app/admin/model/hospital.model';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfigService } from '../../../config';
import { UnsubscribeOnDestroyAdapter, TableElement, TableExportUtil } from '../../../shared';
import { fromEvent, BehaviorSubject, Observable, merge, map } from 'rxjs';
import { NgClass, DatePipe, formatDate, CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '../../../shared/components/feather-icons/feather-icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { PrintTokenComponentComponent } from '../print-token-component/print-token-component.component';
import { Direction } from '@angular/cdk/bidi';
import { PrintLabelComponentComponent } from '../print-label-component/print-label-component.component';
import { PrintCasePaperComponent } from '../print-case-paper/print-case-paper.component';
import { DeleteDialogComponent } from './dialogs/delete/delete.component';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { ChangeHospitalComponent } from './dialogs/change-hospital/change-hospital.component';
import { FormDialogComponent } from './dialogs/form-dialog/form-dialog.component';
import { Services } from 'app/admin/model/services.model';


export interface DialogData {
  id: number;
  firstName: string;
  lastName: string;
  action: string;
  servicesList: any;
  appointment_id: number;
  // appointment: Appointments;
}

@Component({
  selector: 'app-today-appointment',
  templateUrl: './today-appointment.component.html',
  styleUrls: ['./today-appointment.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
  standalone: true,
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
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    CommonModule,
    SharedModule,
  ],
})
export class TodayAppointmentComponent extends UnsubscribeOnDestroyAdapter implements OnInit {

  displayedColumns = [
    // 'select',
    // 'id',
    'sno',
    'name',
    //'mobileNumber',
    //'gender',
    'status',
    'priority',
    //'dob',
    //'address',
    //'createdBy',
    'appointmentTime',
    'actions'
  ];
  

  exampleDatabase?: AppointmentsService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<Hospital>(true, []);
  index!: number;
  hospitalId!: number;
  hospitalList!: Hospital;
  id: any;
  startDate: Date = new Date();
  endDate: Date = new Date();
  Time: Date=new Date();
  appointmentStatus = 'All';

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public dialogRef: MatDialog,
    private snackBar: MatSnackBar,
    public config: ConfigService,
    private router: Router,
    public appointmentsService: AppointmentsService, 
    private _snackBar: MatSnackBar,
    public datepipe: DatePipe
  ) {
    super();
  }
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;

  currentISTTime: string = '';



getCurrentISTDate(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 60 * 60 * 1000;
  return new Date(utc + istOffset);
}

setCurrentISTTime() {
  const istDate = this.getCurrentISTDate();
  this.currentISTTime = this.datepipe.transform(istDate, 'dd-MM-yyyy HH:mm:ss') ?? '';
}

  ngOnInit() {
    this.loadData();
     this.setCurrentISTTime();
     
    
    
    // const row = {}; // Replace with the actual object or data you want to pass
    // this.changeHospital(row);
  }



  
    addServices(appointment_id:number) {
      console.log('addServices called with appointment_id:', appointment_id);
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
      const dialogRef = this.dialog.open(FormDialogComponent, {
        data: {
          appointment_id: appointment_id,
          action: 'add',
        },
        direction: tempDirection,
      });
      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          this.refresh();
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
    editCall1(row: Services) {
      this.id = row.id;
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
      const dialogRef = this.dialog.open(FormDialogComponent, {
        data: {
          servicesList: row,
          action: 'edit',
        },
        direction: tempDirection,
      });
      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          // When using an edit things are little different, firstly we find record inside DataService by id
          // const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          //   (x) => x.subDeptId === this.id
          // );
          // Then you update that record using data from dialogData (values you enetered)
          // if (foundIndex != null && this.exampleDatabase) {
          //   this.refresh();
          //   this.refreshTable();
          //   this.showNotification(
          //     'black',
          //     'Edit Record Successfully...!!!',
          //     'bottom',
          //     'center'
          //   );
          // }
        }
      });
    }
    
    private refreshTable() {
      this.paginator._changePageSize(this.paginator.pageSize);
    }









  refresh() {
    this.loadData();
  }

  addNew() {
    this.router.navigate(['/reception/appointments/book']);
  }

  editCall(row: Appointments) {
    this.router.navigate(['/reception/appointments/book'], { queryParams: { appointment : JSON.stringify(row) } });
  }


  // changeHospital(row: any): void {
  //   const dialogRef = this.dialog.open(ChangeHospitalComponent);
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // Yes clicked
  //       console.log('Patient transferred to Trust Hospital.');
  //       // Call your API or handle logic here
  //     } else {
  //       // No clicked
  //       console.log('Patient not transferred.');
  //     }
  //   });
  // }

  // changeHospital(row: any): void {
  //   const dialogRef = this.dialog.open(ChangeHospitalComponent);
  
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       // Yes clicked
  //       const newHospitalId = 2; // Replace with actual ID or logic
  
  //       const updatedData = {
  //         hospital_id: newHospitalId,
  //         is_new_appointment: true, // assuming this is the flag/field
  //       };
  
  //       this.appointmentsService.changeAppointment(row.id, updatedData).subscribe({
  //         next: (res) => {
  //           console.log('Patient transferred successfully', res);
  //           // Optional: Show success toast / refresh table
  //         },
  //         error: (err) => {
  //           console.error('Transfer failed', err);
  //           // Optional: Show error toast
  //         }
  //       });
  //     } else {
  //       console.log('Patient not transferred.');
  //     }
  //   });
  // }

  changeHospital(row: any): void {
    const dialogRef = this.dialog.open(ChangeHospitalComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newHospitalId = 2;
  
        const updatedData = {
          hospital_id: newHospitalId,
          is_new_appointment: true,
        };
  
        this.appointmentsService.changeAppointment(row.id, updatedData).subscribe({
          next: (res) => {
            console.log('Patient transferred successfully', res);
  
            this.snackBar.open('Patient transferred to Trust Hospital successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
  
            // You can also refresh your data table here
          },
          error: (err) => {
            console.error('Transfer failed', err);
            this.snackBar.open('Transfer failed. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            });
          }
        });
      } else {
        console.log('Patient not transferred.');
      }
    });
  }
  
  

  printToken(row: Appointments) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(PrintTokenComponentComponent, {
      data: {
        appoinment: row
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    });
  }

  printLabel(row: Appointments) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(PrintLabelComponentComponent, {
      data: {
        appoinment: row
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    });
  }

  printCasePaper(row: Appointments) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(PrintCasePaperComponent, {
      data: {
        appoinment: row
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    });
  }
  deleteItem(row: Appointments) {
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
          (x) => x.id === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
          this.showNotification(
            'snackbar-danger',
            'Cancelled Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    });
  }

  cancelAppointment(row : Appointments) {
    row.status = 'Cancelled';
    this.appointmentsService.updateAppointments(row).subscribe((result: any) => {
      if (result['message'] == 'Data Modified Successfully') {
        this.openSnackBar(result['message']);
        this.loadData();
      } else {
        this.openSnackBar(result['message']);
      }
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  public loadData() {
    this.sort.active = 'appointmentDate';
    this.sort.direction = 'desc';
    this.exampleDatabase = new AppointmentsService(this.httpClient, this.config);
    
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort,
      this.startDate,
      this.endDate,
      this.appointmentStatus,
      
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
        'Name': x.namePrefix+ ' '+x.firstName + ' ' + x.lastName,
        'Mobile NO': x.mobileNumber,
        'Gender': x.gender,
        'Dob': formatDate(new Date(x.dob), 'yyyy-MM-dd', 'en'),
        'Address': x.address,
        'Status': x.status,
        
        'Created By': x.createdBy
      }));

    TableExportUtil.exportToExcel(exportData, 'excel');
  }

  exportPDF() {
    // key name with space add in brackets
    const exportData: Partial<TableElement>[] =
      this.dataSource.filteredData.map((x) => ({
        'Name': x.namePrefix+ ' '+x.firstName + ' ' + x.lastName,
        'Mobile NO': x.mobileNumber,
        'Gender': x.gender,
        'Dob': formatDate(new Date(x.dob), 'yyyy-MM-dd', 'en'),
        'Address': x.address,
        'Status': x.status,
        'Created By': x.createdBy
      }));
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    TableExportUtil.exportToPDF(exportData, 'Appointments For Dates: ' + formatDate(this.startDate, format, locale) + ' to ' + formatDate(this.endDate, format, locale));
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
    public startDate: Date,
    public endDate: Date,
    public appointmentStatus: string
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Appointments[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAppoinments(this.startDate, this.endDate, this.appointmentStatus);
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          // .map(app => ({
          //    ...app,
          //     Time: app.appointmentDate  // add the Time property here
          //   }))
          .filter((appointments: Appointments) => {
            const searchStr = (
              appointments.id +
              appointments.namePrefix+
              appointments.firstName +
              appointments.lastName +
              appointments.mobileNumber +
              appointments.gender +
              appointments.address +
              appointments.status+
              appointments.appointmentTime
              
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
  sortData(data: Appointments[]): Appointments[] {
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
          case 'namePrefix':
          [propertyA, propertyB] = [a.namePrefix, b.namePrefix];
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
        case 'email':
          [propertyA, propertyB] = [a.email, b.email];
          break;
        case 'address':
          [propertyA, propertyB] = [a.address, b.address];
          break;
        case 'status':
          [propertyA, propertyB] = [a.status, b.status];
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

