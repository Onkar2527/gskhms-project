import { Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, catchError, map, merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../../shared';
import { Patient } from '../../../../app/admin/patients/allpatients/patient.model';
import { PatientService } from '../../../../app/admin/service/patient.service';
import { ConfigService } from '../../../config';
import { DropdownService } from '../../../../app/admin/service/dropdown.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/authentication/login.service';
import { MatDialog } from '@angular/material/dialog';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { SharedModule } from '@shared/shared.module';
import { InitialClinicalAssessment } from '../model/initial-clinical-assessment.model';
import { InitialClinicalAssessmentService } from '../services/initial-clinical-assessment.service';

@Component({
  selector: 'app-initial-clinical-assessment',
  templateUrl: './initial-clinical-assessment.component.html',
  styleUrls: ['./initial-clinical-assessment.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    MatProgressSpinnerModule
  ],
})
export class InitialClinicalAssessmentComponent extends UnsubscribeOnDestroyAdapter {
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
  assessment!: InitialClinicalAssessment;
  panleTitle = 'Initial Clinical Assessment';
  hospital_code!:string;
  currentYear!:any;

  @ViewChild('filter', { static: true }) filter?: ElementRef;

  constructor(private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public initialClinicalAssessmentService: InitialClinicalAssessmentService,
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
      seCVS: [''],
      seRS: [''],
      generalExaminationJVP: [''],
      generalExamination_Pallor: [''],
      pallorIcterus: [''],
      pallorCyanosis: [''],
      pallorClubbing: [''],
      pallorLymphadenopathy: [''],
      pallorOdema: [''],
      generalExaminationBuilt: [''],
      builtLean: [''],
      builtAverage: [''],
      builtHealthy: [''],
      builtObese: [''],
      nutritionalAssessment: [''],
      naWN: [''],
      naMM: [''],
      naSM: [''],
      pastTreatmentHistory: [''],
      familyHistory: [''],
      menstrualHistory: [''],
      doctorId: [''],
      personalHistory: [''],
      admissionDate: [new Date(), [Validators.required]],
      pastHistory: [''],
      presentIllnessHistory: [''],
      chiefComplaint: [''],
      assessmentVitalId:[null],
      appointmentId:[''],
      hospitalId: [this.hospitalId],
      systematicExaminationFindings:[''],
      seAbdomen:[''],
      seCNS:[''],
      seMusculoskeletalSystem:[''],
      seGenitalia:[''],
      localExamination:[''],
      provisionalDiagnosis:[''],
      finalDiagnosis:[''],
      planOfCare:[''],
      desiredOutcome:[''],
      appointmentNumber: [''],
      patientId: [''],
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
      this.panleTitle = 'Edit Initial Assessment';
    }
  }

  onSubmit() {
    if(this.bookingForm.get('builtLean').value == true){
      this.bookingForm.get('generalExaminationBuilt').patchValue('Lean');
    } else if(this.bookingForm.get('builtAverage').value == true){
      this.bookingForm.get('generalExaminationBuilt').patchValue('Average');
    } else if(this.bookingForm.get('builtHealthy').value == true){
      this.bookingForm.get('generalExaminationBuilt').patchValue('Healthy');
    } else if(this.bookingForm.get('builtObese').value == true){
      this.bookingForm.get('generalExaminationBuilt').patchValue('Obese');
    }

    if(this.bookingForm.get('naWN').value == true){
      this.bookingForm.get('nutritionalAssessment').patchValue('Well-nourished Normal');
    } else if(this.bookingForm.get('naMM').value == true){
      this.bookingForm.get('nutritionalAssessment').patchValue('Mildly/moderately malnourished');
    } else if(this.bookingForm.get('naSM').value == true){
      this.bookingForm.get('nutritionalAssessment').patchValue('Severely malnourished');
    }

    if(this.bookingForm.get('pallorIcterus').value == true){
      this.bookingForm.get('generalExamination_Pallor').patchValue('Icterus');
    } else if(this.bookingForm.get('pallorCyanosis').value == true){
      this.bookingForm.get('generalExamination_Pallor').patchValue('Cyanosis');
    } else if(this.bookingForm.get('pallorClubbing').value == true){
      this.bookingForm.get('generalExamination_Pallor').patchValue('Clubbing');
    } else if(this.bookingForm.get('pallorLymphadenopathy').value == true){
      this.bookingForm.get('generalExamination_Pallor').patchValue('Lymphadenopathy');
    } else if(this.bookingForm.get('pallorOdema').value == true){
      this.bookingForm.get('generalExamination_Pallor').patchValue('Odema');
    }

    if(this.assessmentId == -1){
      this.initialClinicalAssessmentService.addAssessment(this.bookingForm.value).pipe(
        catchError(() => {
          this.openSnackBar('Error occurred to add');
          return '';
        })
      ).subscribe((result: any) => {
        this.openSnackBar(result['message']);
        this.router.navigate(['/doctor/initial-clinical-assessment-list']);
      })
    }else{
      this.initialClinicalAssessmentService.updateAssessment(this.bookingForm.value).subscribe((result: any) => {
        if (result['message'] == 'Data Modified Successfully') {
          this.openSnackBar(result['message']);
        } else {
          this.openSnackBar(result['message']);
        }
        this.router.navigate(['/doctor/initial-clinical-assessment-list']);
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
        seCVS: this.assessment.seCVS,
        seRS: this.assessment.seRS,
        generalExaminationJVP: this.assessment.generalExaminationJVP,
        generalExamination_Pallor: this.assessment.generalExamination_Pallor,
        generalExaminationBuilt: this.assessment.generalExaminationBuilt,
        nutritionalAssessment: this.assessment.nutritionalAssessment,
        pastTreatmentHistory: this.assessment.pastTreatmentHistory,
        familyHistory: this.assessment.familyHistory,
        menstrualHistory: this.assessment.menstrualHistory,
        doctorId: this.assessment.doctorId,
        personalHistory: this.assessment.personalHistory,
        admissionDate: this.assessment.admissionDate,
        pastHistory: this.assessment.pastHistory,
        presentIllnessHistory: this.assessment.presentIllnessHistory,
        chiefComplaint: this.assessment.chiefComplaint,
        assessmentVitalId: this.assessment.assessmentVitalId,
        appointmentId: this.assessment.appointmentId,
        hospitalId: this.assessment.hospitalId,
        systematicExaminationFindings: this.assessment.systematicExaminationFindings,
        seAbdomen: this.assessment.seAbdomen,
        seCNS: this.assessment.seCNS,
        seMusculoskeletalSystem: this.assessment.seMusculoskeletalSystem,
        seGenitalia: this.assessment.seGenitalia,
        localExamination: this.assessment.localExamination,
        provisionalDiagnosis: this.assessment.provisionalDiagnosis,
        finalDiagnosis: this.assessment.finalDiagnosis,
        planOfCare: this.assessment.planOfCare,
        desiredOutcome: this.assessment.desiredOutcome,
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

      if (this.bookingForm.get('generalExaminationBuilt').value == 'Lean') {
        this.bookingForm.get('builtLean').patchValue(true);
      } else if (this.bookingForm.get('generalExaminationBuilt').value == 'Average') {
        this.bookingForm.get('builtAverage').patchValue(true);
      } else if (this.bookingForm.get('generalExaminationBuilt').value == 'Healthy') {
        this.bookingForm.get('builtHealthy').patchValue(true);
      } else if (this.bookingForm.get('generalExaminationBuilt').value == 'Obese') {
        this.bookingForm.get('builtObese').patchValue(true);
      }

      if (this.bookingForm.get('nutritionalAssessment').value == 'Well-nourished Normal') {
        this.bookingForm.get('naWN').patchValue(true);
      } else if (this.bookingForm.get('nutritionalAssessment').value == 'Mildly/moderately malnourished') {
        this.bookingForm.get('naMM').patchValue(true);
      } else if (this.bookingForm.get('nutritionalAssessment').value == 'Severely malnourished') {
        this.bookingForm.get('naSM').patchValue(true);
      }

      if (this.bookingForm.get('generalExamination_Pallor').value == 'Icterus') {
        this.bookingForm.get('pallorIcterus').patchValue(true);
      } else if (this.bookingForm.get('generalExamination_Pallor').value == 'Cyanosis') {
        this.bookingForm.get('pallorCyanosis').patchValue(true);
      } else if (this.bookingForm.get('generalExamination_Pallor').value == 'Clubbing') {
        this.bookingForm.get('pallorClubbing').patchValue(true);
      } else if (this.bookingForm.get('generalExamination_Pallor').value == 'Lymphadenopathy') {
        this.bookingForm.get('pallorLymphadenopathy').patchValue(true);
      } else if (this.bookingForm.get('generalExamination_Pallor').value == 'Odema') {
        this.bookingForm.get('pallorOdema').patchValue(true);
      }
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
