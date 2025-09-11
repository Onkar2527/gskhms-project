import { Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
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
import { BehaviorSubject, Observable, catchError, map, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../../shared';
import { Patient } from '../../../../app/admin/patients/allpatients/patient.model';
import { PatientService } from '../../../../app/admin/service/patient.service';
import { ConfigService } from '../../../config';
import { FeatherIconsComponent } from '../../../shared/components/feather-icons/feather-icons.component';
import { DropdownService } from '../../../../app/admin/service/dropdown.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/authentication/login.service';
import { MatDialog } from '@angular/material/dialog';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { EmergencyClinicalAssessment } from '../model/emergency-clinical-assessment.model';
import { EmergencyClinicalAssessmentService } from '../services/emergency-clinical-assessment.service';

@Component({
  selector: 'app-emergency-clinical-assessment',
  templateUrl: './emergency-clinical-assessment.component.html',
  styleUrls: ['./emergency-clinical-assessment.component.scss'],
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
export class EmergencyClinicalAssessmentComponent extends UnsubscribeOnDestroyAdapter {
  bookingForm: any;

  filterToggle = false;
  displayedColumns = [
    'name',
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
  appointments?: any;

  searchExisting = false;
  doctors$: any;
  services$: any;
  hospitalId = 0;
  assessmentId = -1;
  assessment!: EmergencyClinicalAssessment;
  panleTitle = 'Emergency Clinical Assessment';
  hospital_code!:string;
  currentYear!:any;

  @ViewChild('filter', { static: true }) filter?: ElementRef;

  constructor(private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public emergencyClinicalAssessmentService: EmergencyClinicalAssessmentService,
    private config: ConfigService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public dropDownService: DropdownService,
    public loginService:LoginService,
    private formBuilder: FormBuilder,
  ) {
    super();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    this.hospitalId = currentUser.hospitalId;
    this.bookingForm = this.fb.group({
      id: [null],
      consultant: [''],
      appointmentNumber: [''],
      broughtByVehicle: [''],
      vehicleIdentity: [''],
      preHospitalCare: [''],
      preHospitalCareDetails: [''],
      allergies: [''],
      lastMealDetails: [''],
      lastMealTime: [''],
      medications: [''],
      pastMedicalHistory: [''],
      pastSergicalHistory: [''],
      eventsLeadingToTrauma: [''],
      painScore: [''],
      admitStatus: ['Recommended'],
      assessmentVitalDTOList: new FormArray([this.formBuilder.group({
        id: [],
        measureTime: [new Date()],
        appointmentId: [],
        pulse: [],
        rr: [],
        bp: [],
        temperature: [],
        hr: [],
        spo2: [],
        hospitalId: [],
        abdGrith: [],
        weight: [],
        others: []
      })]),
      patientDetails: this.fb.group({
        patientId: [''],
        namePrefix: [''],
        firstName: [''],
        middleName: [''],
        lastName: [''],
        fatherName: [''],
        dob: [''],
        gender: [''],
        maritalStatus: [''],
        mobileNumber: [''],
        patientUHIDNumber: [,''],
        aadharNumber: [''],
        address: ['']
      })
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.assessment = params['data']; // Access the 'id' parameter from the URL
    });
    this.loginService.currentLoggedInUser.subscribe((user:any)=>{
      this.hospital_code=user.hospitalCode;
    });
    this.bookingForm.get('subDocType')?.setValue(this.hospital_code);
    this.route.queryParams.subscribe(params => {
      if(params['assessment']){
        this.assessment = JSON.parse(params['assessment']);
        this.assessmentId = this.assessment.id;
        this.populateAssessment();
      }
    });
    if(this.assessmentId != -1){
      this.panleTitle = 'Edit Emergency Assessment';
    }
  }

  onSubmit() {
    if(this.assessmentId == -1){
      this.emergencyClinicalAssessmentService.addAssessment(this.bookingForm.value).pipe(
        catchError(() => {
          this.openSnackBar('Error occurred to add');
          return '';
        })
      ).subscribe((result: any) => {
        this.openSnackBar(result['message']);
        this.router.navigate(['/doctor/emergency-clinical-assessment-list']);
      })
    }else{
      this.emergencyClinicalAssessmentService.updateAssessment(this.bookingForm.value).subscribe((result: any) => {
        if (result['message'] == 'Data Modified Successfully') {
          this.openSnackBar(result['message']);
        } else {
          this.openSnackBar(result['message']);
        }
        this.router.navigate(['/doctor/emergency-clinical-assessment-list']);
      })
    }
  }

  selectCell(row: any){
    this.bookingForm.get('patientDetails').get('namePrefix')?.patchValue(row.namePrefix);
    this.bookingForm.get('patientDetails').get('patientId')?.patchValue(row.patientId);
    this.bookingForm.get('patientDetails').get('firstName')?.patchValue(row.firstName);
    this.bookingForm.get('patientDetails').get('aadharNumber')?.patchValue(row.aadharNumber);
    this.bookingForm.get('patientDetails').get('lastName')?.patchValue(row.lastName);
    this.bookingForm.get('patientDetails').get('gender')?.patchValue(row.gender);
    this.bookingForm.get('patientDetails').get('address')?.patchValue(row.address);
    this.bookingForm.get('patientDetails').get('dob')?.patchValue(row.dob);
    this.bookingForm.get('patientDetails').get('mobileNumber')?.patchValue(row.mobileNumber);
  }

  public loadData() {
    if (this.bookingForm.get('patientDetails').get('mobileNumber')?.value?.length == 10 || this.bookingForm.get('patientDetails').get('firstName')?.value?.length > 2 || this.bookingForm.get('patientDetails').get('lastName')?.value?.length > 2) {
      this.bookingForm.get('patientDetails').get('namePrefix')?.patchValue(null);
      this.bookingForm.get('patientDetails').get('patientId')?.patchValue(null);
      this.bookingForm.get('patientDetails').get('aadharNumber')?.patchValue(null);
      this.bookingForm.get('patientDetails').get('gender')?.patchValue('');
      this.bookingForm.get('patientDetails').get('address')?.patchValue(null);
      this.bookingForm.get('patientDetails').get('dob')?.patchValue(null);
      this.exampleDatabase = new PatientService(this.httpClient, this.config);
      this.exampleDatabase.getAllPatientsByMNumberFnameLname(this.bookingForm.get('patientDetails').get('mobileNumber')?.value, this.bookingForm.get('patientDetails').get('firstName')?.value, this.bookingForm.get('patientDetails').get('lastName')?.value).pipe(
        catchError(() => {
          return '';
        })
      ).subscribe((result: any) => {
        if (result.data.length > 0 && !this.searchExisting) {
          this.searchExisting = true;
          this.dataSource = new ExampleDataSource(
            result.data
          );
        } else {
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

  populateAssessment() {
    if (this.assessment) {
      this.bookingForm.patchValue({
        id: this.assessment.id,
        consultant: this.assessment.consultant,
        broughtByVehicle: this.assessment.broughtByVehicle,
        vehicleIdentity: this.assessment.vehicleIdentity,
        preHospitalCare: this.assessment.preHospitalCare,
        preHospitalCareDetails: this.assessment.preHospitalCareDetails,
        allergies: this.assessment.allergies,
        lastMealDetails: this.assessment.lastMealDetails,
        lastMealTime: this.assessment.lastMealTime,
        medications: this.assessment.medications,
        pastMedicalHistory: this.assessment.pastMedicalHistory,
        pastSergicalHistory: this.assessment.pastSergicalHistory,
        eventsLeadingToTrauma: this.assessment.eventsLeadingToTrauma,
        painScore: this.assessment.painScore,
        appointmentId: this.assessment.appointmentId,
        hospitalId: this.assessment.hospitalId,
        appointmentNumber: this.assessment.appointmentNumber,
        patientId: this.assessment.patientId,
        admitStatus: this.assessment.admitStatus,
        assessmentVitalDTOList: [{
          id: this.assessment.assessmentVitalDTOList[0].id,
          measureTime: this.assessment.assessmentVitalDTOList[0].measureTime,
          appointmentId: this.assessment.assessmentVitalDTOList[0].appointmentId,
          pulse: this.assessment.assessmentVitalDTOList[0].pulse,
          rr: this.assessment.assessmentVitalDTOList[0].rr,
          bp: this.assessment.assessmentVitalDTOList[0].bp,
          temperature: this.assessment.assessmentVitalDTOList[0].temperature,
          hr: this.assessment.assessmentVitalDTOList[0].hr,
          spo2: this.assessment.assessmentVitalDTOList[0].spo2,
          hospitalId: this.assessment.assessmentVitalDTOList[0].hospitalId,
          abdGrith: this.assessment.assessmentVitalDTOList[0].abdGrith,
          weight: this.assessment.assessmentVitalDTOList[0].weight,
          others: this.assessment.assessmentVitalDTOList[0].others
        }],
        patientDetails: {
          patientId: this.assessment.patientDetails.patientId,
          namePrefix: this.assessment.patientDetails.namePrefix,
          firstName: this.assessment.patientDetails.firstName,
          middleName: this.assessment.patientDetails.middleName,
          lastName: this.assessment.patientDetails.lastName,
          fatherName: this.assessment.patientDetails.fatherName,
          dob: this.assessment.patientDetails.dob,
          gender: this.assessment.patientDetails.gender,
          maritalStatus: this.assessment.patientDetails.maritalStatus,
          mobileNumber: this.assessment.patientDetails.mobileNumber,
          patientUHIDNumber: this.assessment.patientDetails.patientUHIDNumber,
          aadharNumber: this.assessment.patientDetails.aadharNumber,
          address: this.assessment.patientDetails.address
        }
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
