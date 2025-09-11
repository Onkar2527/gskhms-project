import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from 'app/admin/employees/allemployees/employees.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { BehaviorSubject, Observable, catchError, fromEvent, map, merge } from 'rxjs';
import { ServiceRateService } from 'app/admin/service/servicerate.service';
import { ServiceRate } from 'app/admin/model/servicerate.model';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { Services } from 'app/admin/model/services.model';
import { DropdownService } from 'app/admin/service/dropdown.service';

export interface DialogData {
  id: number;
  action: string;
  doctors: Employee;
}

@Component({
  selector: 'app-form-dialog:not(f)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  standalone: true,
  imports: [
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    NgFor,
    MatCheckboxModule,
    CommonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogClose,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    DatePipe,
    BreadcrumbComponent,
    FileUploadComponent,
    MatInputModule 
  ],
})

export class FormDialogComponent  extends UnsubscribeOnDestroyAdapter
implements OnInit{
  serviceRateForm: any;
  action: string;
  dialogTitle: string;
  doctorsForm: any;
  doctors: Employee;
  services$: Services[] = [];
  displayedColumns = [
    'serviceName',
    'existingRate',
    'startDate',
    'serviceRate',
    'actions',
  ];

  exampleDatabase?: ServiceRateService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<ServiceRate>(true, []);
  index?: number;
  id?: number;
  serviceRates?: ServiceRate[];
  addServiceRate = false;
  isTblLoading = false;
  todaysDate = new Date();
  errorMsg = '';
  successMsg = '';

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public httpClient: HttpClient,
    public serviceRateService: ServiceRateService,
    public config: ConfigService,
    public dropDownService: DropdownService,
  ) {
    super();
    // Set the defaults
    this.action = data.action;
    this.dialogTitle = 'Service Rates';
    this.doctors = data.doctors;
  }
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  
  ngOnInit() {
    this.isTblLoading = true;
    this.loadData(); 
    this.isTblLoading = false;
  }

  refresh() {
    this.isTblLoading = true;
    this.loadData();
    this.isTblLoading = false;
    this.successMsg = '';
    this.errorMsg = '';
  }

  addServiceRates(row: ServiceRate) {
    this.serviceRateService.addServiceRate(row).pipe(
      catchError(() => {
        this.errorMsg = 'Error occurred to add';
        this.successMsg = '';
        return '';
      })
    )
    .subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.successMsg = result['message'];
        this.errorMsg = '';
      } 
    })
  }

  public loadData() {
    this.exampleDatabase = new ServiceRateService(this.httpClient, this.config);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.doctors,
      this.doctors.employeeId
    );
    if(this.filter){
      this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
        () => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        }
      );
    }
  }
}

export class ExampleDataSource extends DataSource<ServiceRate> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: ServiceRate[] = [];
  renderedData: ServiceRate[] = [];
  constructor(
    public exampleDatabase: ServiceRateService,
    public doctor: Employee,
    public userId: number
  ) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ServiceRate[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.filterChange,
    ];
    this.exampleDatabase.getServiceRates(this.userId);
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.exampleDatabase.data
        .slice()
        .filter((serviceRate: ServiceRate) => {
          const searchStr = (
            serviceRate.employeeId +
            serviceRate.userName +
            serviceRate.serviceId +
            serviceRate.serviceName +
            serviceRate.startDate +
            serviceRate.serviceRate +
            serviceRate.oldServiceRate +
            serviceRate.hospitalId
          ).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
        this.renderedData = this.filteredData;
        return this.renderedData;
      })
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() { }
}