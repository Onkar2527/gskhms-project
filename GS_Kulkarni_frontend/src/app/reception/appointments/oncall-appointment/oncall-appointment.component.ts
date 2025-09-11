import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { Patient } from 'app/admin/patients/allpatients/patient.model';
import { PatientService } from 'app/admin/service/patient.service';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { BehaviorSubject, catchError, map, merge, Observable } from 'rxjs';
import { PrintTokenComponentComponent } from '../print-token-component/print-token-component.component';
import { Direction } from '@angular/cdk/bidi';
import { DepartmentList } from 'app/admin/departments/department-list/department-list.model';
import { Employee } from 'app/admin/employees/allemployees/employees.model';
import { Services } from 'app/admin/model/services.model';
import { HttpClient } from '@angular/common/http';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { ConfigService } from '@config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { LoginService } from 'app/authentication/login.service';

@Component({
  selector: 'app-oncall-appointment',
  standalone: true,
  templateUrl: './oncall-appointment.component.html',
  styleUrl: './oncall-appointment.component.scss',
  imports: [
    BreadcrumbComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatButtonToggleModule,
        FileUploadComponent,
        MatButtonModule,
        MatTooltipModule,
        MatTableModule,
        MatSortModule,
        NgClass,
        MatCheckboxModule,
        MatMenuModule,
        MatIconModule,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        CommonModule,
        FeatherIconsComponent,


  ],
})
export class OncallAppointmentComponent extends UnsubscribeOnDestroyAdapter{

   bookingForm: UntypedFormGroup;
    hide3 = true;
    agree3 = false;
    isDisabled = true;
  
    filterToggle = false;
    displayedColumns = [
      'name',
      // 'firstName',
      // 'lastName',
      'mobileNumber',
      'address',
      'dob',
      'gender',
      'actions',
    ];
  
    exampleDatabase?: PatientService;
    dataSource!: ExampleDataSource;
    selection = new SelectionModel<Appointments>(true, []);
    id?: number;
    appointments?: Appointments;
  
    searchExisting = false;
    doctors$: any;
    services$: any;
    departments$: any;
    groupId$: any;
    hospitalId = 0;
    appointmentId = -1;
    appointment!: Appointments;
    panleTitle = 'On Call Appointment';
    hospital_code!:string;
    currentYear!:any;
    priority!:any;
    referredBy!: string;
    appointmentTime!:Date;
    age!:string;

     @ViewChild('filter', { static: true }) filter?: ElementRef;
  
    
      constructor(private fb: UntypedFormBuilder,
        public httpClient: HttpClient,
        public appointmentsService: AppointmentsService,
        private config: ConfigService,
        private _snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        public dropDownService: DropdownService,
        public loginService:LoginService) {
        super();
        const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
        this.hospitalId = currentUser.hospitalId;
        this.bookingForm = this.fb.group({
          id: [null],
          namePrefix: ['Mrs.', [Validators.required]],
          mobileNumber: ['', [Validators.required]],
          firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
          lastName: ['',[Validators.required]],
          aadharNumber: [''],
          gender: ['F',],
          type: ['opd'],
          address: [''],
          dob: [''],
          doctorId: [''],
          serviceId: [''],
          appointmentDate: [new Date()],
          remark: [''],
          uploadFile: [''],
          patientId: [''],
          status: ['OnCall'],
          docType:['OPD'],
          subDocType:[''],
          hospitalId: [this.hospitalId],
          maidenName: [''],
          husbandName: [''],
          abhaNumber: [''],
          fatherName: [''],
          deptId: [''],
          serviceGroupId: [''],
          referredBy: [''],
          priority: ['Normal'],
          appointmentTime:[''],
          age:['']
    
    
        });
      }
    
      ngOnInit(): void {
        this.loginService.currentLoggedInUser.subscribe((user:any)=>{
          this.hospital_code=user.hospitalCode;
        });
        this.bookingForm.get('subDocType')?.setValue(this.hospital_code);
        this.route.queryParams.subscribe(params => {
          if(params['appointment']){
            this.appointment = JSON.parse(params['appointment']);
            this.appointmentId = this.appointment.id;
            this.populateAppointment();
          }
        });
        if(this.appointmentId != -1){
          this.panleTitle = 'Edit Appointment';
        }
        this.getServices();
        this.getDoctors();
        this.getDepartments();
      }
    
      getServices() {
        const data = new Services();
        // data.status = 'Active';
        data.hospitalId = this.hospitalId;
        this.dropDownService.servicesCombo(data).subscribe((result: any) => {
          this.services$ = result.data;
        });
      }
    
      getgroupServices() {
        const data = new Services();
        data.hospitalId = this.hospitalId;
        this.dropDownService.servicesCombo(data).subscribe((result: any) => {
          this.groupId$ = result.data;
        });
      }
    
      getDoctors() {
        const data = new Employee();
        // data.status = 'Active';
        data.hospitalId = this.hospitalId;
        data.userType = 'D';
        this.dropDownService.doctorsCombo(data).subscribe((result: any) => {
          this.doctors$ = result.data;
        });
      }
    
    
       getDepartments() {
            const data = new DepartmentList();
            data.status = 'Active';
            this.dropDownService.departmentCombo(data).subscribe((result: any) => {
              this.departments$ = result.data;
              console.log("department combo ", this.departments$)
            });
          } 
      
          // serviceGroupCombo(){
          //   let data = new ServiceGroup();
          //   this.dropdownService.serviceGroupCombo(data).subscribe((result: any) => {
          //     this.serviceGroupCombo$ = result.data;
          //     console.log("service group combo ", this.serviceGroupCombo$)
          //   });
          // }
    
    
    
      // getAllDepartmentLists(): void {
      //   const data1 = new DepartmentList();
      //   this.subs.sink = this.httpClient
      //     .post<any>(this.apiBaseUrl + 'dept/search', data1)
      //     .subscribe({
      //       next: (data) => {
      //         this.isTblLoading = false;
      //         this.dataChange.next(data.data);
      //       },
      //       error: (error: HttpErrorResponse) => {
      //         this.isTblLoading = false;
      //         console.log(error.name + ' ' + error.message);
      //       },
      //     });
      // }
    
      onSubmit() {
        if(this.appointmentId == -1){
          this.appointmentsService.addAppointments(this.bookingForm.value).pipe(
            catchError(() => {
              this.openSnackBar('Error occurred to add');
              return '';
            })
          ).subscribe((result: any) => {
            if (result['message'] == 'Data Saved Successfully') {
              let tempDirection: Direction;
              if (localStorage.getItem('isRtl') === 'true') {
                tempDirection = 'rtl';
              } else {
                tempDirection = 'ltr';
              }
              this.dialog.open(PrintTokenComponentComponent, {
                data: {
                  appoinment: result['data']
                },
                direction: tempDirection,
                height: '80%',
                width: '80%'
              }).afterClosed()
              .subscribe((res) => {
                this.router.navigate(['/reception/appointments/today']);
              });
            }
          })
        }else{
          this.appointmentsService.updateAppointments(this.bookingForm.value).subscribe((result: any) => {
            if (result['message'] == 'Data Modified Successfully') {
              this.openSnackBar(result['message']);
              history.back();
            } else {
              this.openSnackBar(result['message']);
            }
          })
        }
      }
    
      selectCell(row: any){
        this.bookingForm.get('namePrefix')?.patchValue(row.namePrefix);
        this.bookingForm.get('patientId')?.patchValue(row.patientId);
        this.bookingForm.get('firstName')?.patchValue(row.firstName);
        this.bookingForm.get('aadharNumber')?.patchValue(row.aadharNumber);
        this.bookingForm.get('lastName')?.patchValue(row.lastName);
        this.bookingForm.get('gender')?.patchValue(row.gender);
        this.bookingForm.get('address')?.patchValue(row.address);
        this.bookingForm.get('dob')?.patchValue(row.dob);
        this.bookingForm.get('mobileNumber')?.patchValue(row.mobileNumber);
        this.bookingForm.get('maidenName')?.patchValue(row.maidenName);
        this.bookingForm.get('husbandName')?.patchValue(row.husbandName);
        this.bookingForm.get('abhaNumber')?.patchValue(row.abhaNumber);
        this.bookingForm.get('fatherName')?.patchValue(row.fatherName);
        this.bookingForm.get('priority')?.patchValue(row.priority);
        this.bookingForm.get('referredBy')?.patchValue(row.referredBy);
        this.bookingForm.get('appappointmentTime')?.patchValue(row.appappointmentTime)
        this.bookingForm.get('age')?.patchValue(row.age)
        
      }

       public loadData() {
        if(this.bookingForm.get('mobileNumber')?.value?.length == 10 || this.bookingForm.get('firstName')?.value?.length > 2 || this.bookingForm.get('lastName')?.value?.length > 2){
            // this.bookingForm.get('namePrefix')?.patchValue(null);
            this.bookingForm.get('patientId')?.patchValue(null);
            // this.bookingForm.get('firstName')?.patchValue(null);
            this.bookingForm.get('aadharNumber')?.patchValue(null);
            // this.bookingForm.get('lastName')?.patchValue(null);
            this.bookingForm.get('gender')?.patchValue('');
            this.bookingForm.get('address')?.patchValue(null);
            this.bookingForm.get('dob')?.patchValue(null);
            this.bookingForm.get('maidenName')?.patchValue(null);
           // this.bookingForm.get('husbandName')?.patchValue(null);
            this.bookingForm.get('abhaNumber')?.patchValue(null);
            this.bookingForm.get('fatherName')?.patchValue(null);
            this.bookingForm.get('priority')?.patchValue(null);
            this.bookingForm.get('referredBy')?.patchValue(null);
            this.bookingForm.get('appointmentTime')?.patchValue(null);
            this.bookingForm.get('age')?.patchValue(null);
            
            
            this.exampleDatabase = new PatientService(this.httpClient, this.config);
            this.exampleDatabase.getAllPatientsByMNumberFnameLname(this.bookingForm.get('mobileNumber')?.value, this.bookingForm.get('firstName')?.value, this.bookingForm.get('lastName')?.value).pipe(
              catchError(() => {
                return '';
              })
            ).subscribe((result: any) => {
              if(result.data.length > 0 && !this.searchExisting){
                this.searchExisting = true;
                this.dataSource = new ExampleDataSource(
                  result.data
                );
              }else{
                this.searchExisting = false;
              }
            })
          }
        }
      
        get f() {
          return this.bookingForm.controls;
        }
      
        openSnackBar(message: string) {
          this._snackBar.open(message, 'OK', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      
        cancel(){
          history.back();
        }
      
        populateAppointment() {
          if(this.appointment){
              this.bookingForm.patchValue({
                id: this.appointment.id,
                namePrefix: this.appointment.namePrefix,
                mobileNumber: this.appointment.mobileNumber,
                firstName: this.appointment.firstName,
                aadharNumber: this.appointment.aadharNumber,
                lastName: this.appointment.lastName,
                gender: this.appointment.gender,
                type: this.appointment.type,
                address: this.appointment.address,
                dob: this.appointment.dob,
                doctorId: this.appointment.doctorId,
                serviceId: this.appointment.serviceId,
                appointmentDate: this.appointment.appointmentDate,
                remark: this.appointment.remark,
                uploadFile: this.appointment.uploadFile,
                patientId: this.appointment.patientId,
                status: this.appointment.status,
                hospitalId: this.appointment.hospitalId,
                maidenName: this.appointment.maidenName,
                husbandName: this.appointment.husbandName,
                abhaNumber: this.appointment.abhaNumber,
                fatherName: this.appointment.fatherName,
                deptId: this.appointment.deptId,
                priority: this.appointment.priority,
                referredBy: this.appointment.referredBy,
                appointmentTime:this.appointment.appointmentTime,
                age:this.age
              });
          }
        }





}

export class ExampleDataSource extends DataSource<Patient> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: Patient[] = [];
  renderedData: Patient[] = [];
  constructor(
    public existingData:  Patient[],
  ) {
    super();
    // Reset to the first page when the user changes the filter.
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Patient[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      // this.exampleDatabase.dataChange,
      this.filterChange,
    ];
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.existingData
          .slice()
          .filter((patient: Patient) => {
            const searchStr = (
              patient.firstName +
              patient.lastName +
              patient.gender +
              patient.address +
              patient.email +
              patient.dob +
              patient.appointmentDate
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Grab the page's slice of the filtered sorted data.
        this.renderedData = this.filteredData.slice();
        return this.renderedData;
      })
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() { }
}
