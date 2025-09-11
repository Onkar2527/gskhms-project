import { Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { CommonModule, NgClass } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, catchError, fromEvent, map, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Patient } from 'app/admin/patients/allpatients/patient.model';
import { PatientService } from 'app/admin/service/patient.service';
import { ConfigService } from '@config';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { Services } from 'app/admin/model/services.model';
import { Employee } from 'app/admin/employees/allemployees/employees.model';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/authentication/login.service';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { MasterService } from 'app/admin/service/master.service';
import { Bed } from 'app/admin/model/bed.model';
import { EmergencyClinicalAssessmentService } from 'app/doctor/ipd/services/emergency-clinical-assessment.service';
import { InitialClinicalAssessmentService } from 'app/doctor/ipd/services/initial-clinical-assessment.service';
@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss'],
  standalone: true,
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
export class BookAppointmentComponent extends UnsubscribeOnDestroyAdapter {
  bookingForm: UntypedFormGroup;
  hide3 = true;
  agree3 = false;
  isDisabled = true;
  searchExisting = false;

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
  patient?: Patient;
  bed?: Bed;

  seachExisting = false;
  doctors$: any;
  services$: any;
  hospitalId = 0;
  appointmentId = -1;
  appointment!: Appointments;
  panleTitle = 'Book Appointment';
  hospital_code!:string;
  currentYear!:any;
  floorOptions: any[] = [];
  roomOptions: any[] = [];
  bedOptions: any[] = [];

  assessment!: any; 
  emergencyAssessment!: any;

  @ViewChild('filter', { static: true }) filter?: ElementRef;
 
  constructor(private fb: UntypedFormBuilder, 
    public httpClient: HttpClient, 
    public appointmentsService: AppointmentsService, 
    private config: ConfigService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    public dropDownService: DropdownService,
    public loginService:LoginService,
    public masterService: MasterService,
    public initialClinicalAssessmentService: InitialClinicalAssessmentService,
    public emergencyClinicalAssessmentService: EmergencyClinicalAssessmentService,
  ) {
    super();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    this.hospitalId = currentUser.hospitalId;
    this.bookingForm = this.fb.group({
      id: [null],
      namePrefix: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      lastName: [''],
      gender: ['', [Validators.required]],
      type: ['ipd'],
      address: [''],
      dob: ['', [Validators.required]],
      doctorId: ['', [Validators.required]],
      secDoctorId: [''],
      appointmentDate: [new Date(), [Validators.required]],
      remark: [''],
      uploadFile: [''],
      patientId: [''],
      status: ['Waiting'],
      docType:['OPD'],
      subDocType:[''],
      hospitalId: [this.hospitalId],
      floorId: [],
      roomId: [],
      bedId: []
    });
  }

  ngOnInit(): void {
    this.loginService.currentLoggedInUser.subscribe((user:any)=>{
      this.hospital_code=user.hospitalCode;
    });
    this.bookingForm.get('subDocType')?.setValue(this.hospital_code);
    this.route.queryParams.subscribe(params => {
      if(params['assessment']){
        this.assessment = JSON.parse(params['assessment']); 
      }
      if(params['emergencyAssessment']){
        this.emergencyAssessment = JSON.parse(params['emergencyAssessment']); 
      }
      if(params['patient']){
        this.patient = JSON.parse(params['patient']); 
        this.selectCell(this.patient);
      }
      if(params['bed']){
        this.bed = JSON.parse(params['bed']); 
        this.loadFloor();
        this.masterService.getRoom({id: this.bed?.roomId }).subscribe((data:any)=>{
         let roomData = data.data;
         this.bookingForm.get('floorId')?.patchValue(roomData[0].floorId);
        });
        this.loadRooms();
        this.bookingForm.get('roomId')?.patchValue(this.bed?.roomId);
        this.loadBeds();
        this.bookingForm.get('bedId')?.patchValue(this.bed?.id);
        this.masterService.getAppointmentByBed({bedId: this.bed?.id, status: 'A' }).subscribe((data:any)=>{
          let assignedData = data.data;
          this.appointmentId = assignedData[0].appointmentId;
          this.appointmentsService.getAllAppoinment({id: this.appointmentId}).subscribe((data:any)=>{
            this.appointment = data.data[0];
            this.populateAppointment();
           });
         });
      }
    });
    if(this.appointmentId != -1){
      this.panleTitle = 'Edit Appointment';
    }
    this.getServices();
    this.getDoctors();
    this.loadFloor();
  }

  loadFloor(){
    this.masterService.getFloor({}).subscribe((data:any)=>{
      this.floorOptions=data.data;
    })
  }

  loadRooms(){
    this.masterService.getRoom({floorId: this.bookingForm.get('floorId')?.value }).subscribe((data:any)=>{
      this.roomOptions=data.data;
    })
  }

  loadBeds(){
    this.masterService.getBeds({roomId: this.bookingForm.get('roomId')?.value, status: 'A' }).subscribe((data:any)=>{
      this.bedOptions=data.data;
    })
  }

  getServices() {
    const data = new Services();
    // data.status = 'Active';
    data.hospitalId = this.hospitalId;
    this.dropDownService.servicesCombo(data).subscribe((result: any) => {
      this.services$ = result.data;
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

  onSubmit() {
    if(this.appointmentId == -1){
      this.appointmentsService.addAppointments(this.bookingForm.value).pipe(
        catchError(() => {
          this.openSnackBar('Error occurred to add');
          return '';
        })
      ).subscribe((result: any) => {
        this.openSnackBar(result['message']);
        this.router.navigate(['/nurse/bed-management']);
        this.updateRecomendation();
      })
    }else{
      this.appointmentsService.updateAppointments(this.bookingForm.value).subscribe((result: any) => {
        this.openSnackBar(result['message']);
        this.router.navigate(['/nurse/bed-management']);
      })
    }
  }

  updateRecomendation(){
    if(this.assessment){
      this.assessment.admitStatus = 'Admitted';
      this.initialClinicalAssessmentService.updateAssessment(this.assessment).subscribe((result: any) => {
      })
    }
    if(this.emergencyAssessment){
      this.emergencyAssessment.admitStatus = 'Admitted';
      this.emergencyClinicalAssessmentService.updateAssessment(this.emergencyAssessment).subscribe((result: any) => {
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
  }

 public loadData() {
  if(this.bookingForm.get('mobileNumber')?.value?.length == 10 || this.bookingForm.get('firstName')?.value?.length > 2 || this.bookingForm.get('lastName')?.value?.length > 2){
      this.bookingForm.get('namePrefix')?.patchValue(null);
      this.bookingForm.get('patientId')?.patchValue(null);
      // this.bookingForm.get('firstName')?.patchValue(null);
      this.bookingForm.get('aadharNumber')?.patchValue(null);
      // this.bookingForm.get('lastName')?.patchValue(null);
      this.bookingForm.get('gender')?.patchValue('');
      this.bookingForm.get('address')?.patchValue(null);
      this.bookingForm.get('dob')?.patchValue(null);
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
          lastName: this.appointment.lastName,
          gender: this.appointment.gender,
          type: this.appointment.type,
          address: this.appointment.address,
          dob: this.appointment.dob,
          doctorId: this.appointment.doctorId,
          secDoctorId: this.appointment.secDoctorId,
          serviceId: this.appointment.serviceId,
          appointmentDate: this.appointment.appointmentDate,
          remark: this.appointment.remark,
          uploadFile: this.appointment.uploadFile,
          patientId: this.appointment.patientId,
          status: this.appointment.status,
          hospitalId: this.appointment.hospitalId,
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