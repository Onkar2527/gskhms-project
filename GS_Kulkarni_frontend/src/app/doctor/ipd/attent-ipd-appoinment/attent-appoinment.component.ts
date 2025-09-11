import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@config';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { PrescriptionService } from 'app/admin/service/prescription.service';
import { catchError, of } from 'rxjs';
import { LoginService } from 'app/authentication/login.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';
import * as moment from 'moment';
import { Direction } from '@angular/cdk/bidi';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaymentsService } from 'app/accountant/payments.service';
import { MasterService } from 'app/admin/service/master.service';
import { SharedModule } from '@shared/shared.module';
import { RegistrationService } from 'app/lab/service/registration.service';
import { PrintLabReportComponent } from 'app/lab/registration/registration-list/print-lab-report/print-lab-report.component';
import { GenerateReportComponent } from 'app/lab/x-ray-registration/dialogs/generate-report/generate-report.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Pharmacy } from 'app/admin/model/pharmacy.model';
import { PharmacyService } from 'app/admin/service/pharmacy.service';
import { AdditionalServiceComponent } from 'app/doctor/opd/appointments/additional-service/additional-service.component';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { PrescriptionDetail } from 'app/doctor/opd/appointments/prescription-details.model';
import { PrescriptionComponent } from 'app/doctor/ipd/prescription/prescription.component';
import { PrintPrescriptionComponent } from 'app/doctor/ipd/print-prescription/print-prescription.component';
import { PrintDischargeSummary } from '../print-discharge-summary/print-discharge-summary.component';
import { AfterPrescriptionService } from 'app/admin/service/afterprescription.service';
import { DisPrescriptionComponent } from '../dischargePrescription/disprescription.component';
import { GNoteTemplate } from 'app/admin/model/gnoteTemplate.model';
import { co } from '@fullcalendar/core/internal-common';

export interface DialogData {
  id: number;
  action: string;
  bed: any;
  appoinment: any;
}
@Component({
  selector: 'app-attent-appoinment',
  standalone: true,
  templateUrl: './attent-appoinment.component.html',
  styleUrl: './attent-appoinment.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  imports: [
    SharedModule,
    PrescriptionComponent,
    PrintPrescriptionComponent,
    AdditionalServiceComponent,
    MatProgressSpinnerModule,
    DisPrescriptionComponent
  ],
})
export class AttentIPDAppoinmentComponent implements OnInit, AfterViewChecked {
  accordion = viewChild.required(MatAccordion);
  labReportFound:boolean=false;
  xrayReportFound:boolean=false;
  action: string;
  dialogTitle: string;
  appointmentForm: UntypedFormGroup;
  appointment!: Appointments;
  prescriptionDetails!: PrescriptionDetail[];
  prescriptionDetailsAfter!: PrescriptionDetail[];
  pharmacyCombo$!: Pharmacy[];
  dosesCombo$!: any;
  routeCombo$!: any;
  consumeCombo$!: any;
  quantityCombo$!: any;
  prescription!: any;
  afterprescription!: any;
  does!: any;
  quantity!: any;
  duration!: any;
  route!: any;
  consume!: any;
  pharmacyDatabase!: PharmacyService;
  patientId: number = 0;
  appointmentId: number = 0;
  hospitalId: number = 0;
  dataSource: any = [];
  vitalDataSource: any = [];
  continuationsDataSource: any = [];
  medicationsDataSource: any = [];
  paymentDataSource: any = [];
  operations$: any;
  noHistory: boolean = false;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;
  displayedColumns = [
    'name',
    'dateTime',
    'type',
    'disease',
    'doctorName',
    'viewPrescription'
  ];

  displayedVitalsColumns = [
    'measureTime',
    'pulse',
    'rr',
    'bp',
    'temperature',
    'hr',
    'spo2',
    'abdGrith',
    'weight',
    'fhs',
    'others'
  ];

  displayedContinuationsColumns = [
    'noteTime',
    'clinicalNotes',
    'advise',
  ];

  displayedMedicationsColumns = [
    'medicationDate',
    'medication',
    'dose',
    'route',
    'frequency',
  ];

  displayedPaymentColumns = [
    'paymentDate',
    'description',
    'amount',
    'createdBy',
  ];

  bedFacilityForm: any;
  nursingAssessmentForm: any;
  vitalsForm: any;
  continuationForm: any;
  medicationForm: any;
  dischargeSummaryForm: any;
  dischargeSummaryData: any;
  bedFacilityData: any = null;
  nursingAssessmentData: any = null;
  presdcriptionData: any;
  afterPrescriptionData: any;
  showPrescription = false;
  showAfterPrescription = false;
  paymentForm: any;
  paymentData: any = null;
  addExamination: boolean = false;
  appointmentLabServices: any[] = [];
  appointmentXrayServices: any[] = [];
  labData$: any[] = [];
  selectedProcedureOp:string = '';
  xrayData$: any[] = [];
  bed: any;
  labForm: any;
  xrayForm: any;

  constructor(
    public dialogRef: MatDialogRef<AttentIPDAppoinmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public appointmentService: AppointmentsService,
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public config: ConfigService,
    public dropDownService: DropdownService,
    public afterPrescriptionService: AfterPrescriptionService,
    public prescriptionService: PrescriptionService,
    public loginService: LoginService,
    public dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    public paymentService: PaymentsService,
    private formBuilder: FormBuilder,
    private masterService: MasterService,
    private registrationService: RegistrationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle = 'Appointment Details';
    this.bed = data.bed;
    this.patientId = data.bed?.patient.patientId;
    this.bedFacilityForm = this.createBedFacilityForm();
    this.nursingAssessmentForm = this.createNursingAssessmentForm();
    this.masterService?.getAppointmentByBed({ bedId: this.bed?.id, status: 'A' })?.subscribe((data: any) => {
      let assignedData = data.data;
      this.appointmentId = assignedData[0]?.appointmentId ?? data.appoinment?.appointmentId;
      this.appointmentService?.getAllAppoinment({ id: this.appointmentId })?.subscribe((data: any) => {
        this.appointment = data.data[0] ?? data.appoinment;
        this.loadPrescription(true);
        this.AfterloadPrescription(true);
        this.getOPeration();
        this.loadLabReportData(this.appointment.id);
        this.loadXrayReportData(this.appointment.id);
        this.patientId = this.appointment?.patientId;
        if (this.patientId != 0) {
          this.loadPayment();
          this.loadAppoinmentLabServiceDetails(true);
          this.loadAppoinmentXrayServiceDetails(true);
          this.loadAppoinments(this.patientId)
          this.loadBedFacility();
          this.loadVitals();
          this.loadContinuations();
          this.loadMedications();
          this.loadNursingAssessment();
          this.loadDischargeSummary();
          this.labForm = this.createLabForm();
          this.xrayForm = this.createXrayForm();
          this.vitalsForm = this.createVitalsForm();
          this.continuationForm = this.createContinuationForm();
          this.medicationForm = this.createMedicationForm();
          this.paymentForm = this.createPaymentForm();
          this.dischargeSummaryForm = this.createDischargeSummaryForm();
        }
      });
    });
    this.appointmentForm = this.createContactForm();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.loginService.currentLoggedInUser.subscribe((user: any) => {
      if (user != undefined) {
        this.hospitalId = user.hospitalId;
      }
    })
  }

  createDischargeSummaryForm(){
    return this.fb.group({
      id: [ this.dischargeSummaryData ? this.dischargeSummaryData.id : null],
      appointmentId: [this.appointment?.id],
      bedId: [this.bed?.id],
      hospitalId: [this.hospitalId],
      summaryOfInvestigation: [this.dischargeSummaryData?.summaryOfInvestigation],
      courseOfHospitalInv: [this.dischargeSummaryData?.courseOfHospitalInv],
      treatmentGiven: [this.dischargeSummaryData?.treatmentGiven],
      conditionDischargeTime: [this.dischargeSummaryData?.conditionDischargeTime],
      adviseDischargeTime: [this.dischargeSummaryData?.adviseDischargeTime],
      emergencyAfterDischarge: [this.dischargeSummaryData?.emergencyAfterDischarge],
      followupDate: [this.dischargeSummaryData?.followupDate],
      produre: [this.dischargeSummaryData?.produre]
    });
  }

  saveDischargeSummary(){
    this.dischargeSummaryForm.patchValue('appointmentId', this.appointment?.id);
    this.dischargeSummaryForm.patchValue('bedId', this.bed?.id);
    this.appointmentService.saveDischargeSummary(this.dischargeSummaryForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
        this.loadDischargeSummary();
        this.openSnackBar(result['message']);
    })
  }

  printDischargeSummary(){
    let tempDirection: Direction;
    if (localStorage?.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialogRef.close();
    this.dialog.open(PrintDischargeSummary, {
      id: 'Print',
      data: {
        id: this.appointment.id,
        appoinment: this.appointment,
        dischargeSummaryData: this.dischargeSummaryData
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    });
  }

  createLabForm(){
    return this.fb.group({
      patientId: [this.appointment?.patientId],
      appointmentId: [this.appointmentId, Validators.required],
      appointmentServices: [this.appointmentLabServices],
    });
  }

  createXrayForm(){
    return this.fb.group({
      patientId: [this.appointment?.patientId],
      appointmentId: [this.appointmentId, Validators.required],
      appointmentServices: [this.appointmentXrayServices],
    });
  }

  saveLab() {
    this.appointmentService.saveLab(this.labForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
      this.appointmentLabServices = [];
      this.loadAppoinmentLabServiceDetails(true);
      this.loadLabReportData(this.appointment.id);
      this.openSnackBar(result['message']);
    })
  }

  saveXray() {
    this.appointmentService.saveLab(this.xrayForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
      this.appointmentXrayServices = [];
      this.loadAppoinmentXrayServiceDetails(true);
      this.loadXrayReportData(this.appointment.id);
      this.openSnackBar(result['message']);
    })
  }

  loadLabReportData(id: number){
    let data={
        "appointmentId": id,
        // "approvalStatus":"A",
        "type":"T"
      }
    this.registrationService?.getLabReport(data).subscribe((res:any)=>{
      this.labData$=res.data;
        this.labReportFound=this.labData$.length>0;
    })
  }

  loadXrayReportData(id: number){
    let data={
      "appointmentId": id,
      // "status":"Report Generated",
      "type":"X"
    }
    this.registrationService?.getLabReport(data).subscribe((res:any)=>{
      this.xrayData$=res.data;
      this.xrayReportFound = this.xrayData$.length > 0;
    })
  }

  printreport(type: any, id: any, testDetail: any) {
    if (type === 'T') {
      let tempDirection: Direction;
      if (localStorage?.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
      this.dialog.open(PrintLabReportComponent, {
        data: {
          id: id,
          appoinment: this.appointment
        },
        direction: tempDirection,
        height: '80%',
        width: '80%'
      });
    }
    if (type === 'X') {
      let tempDirection: Direction;
      if (localStorage?.getItem('isRtl') === 'true') {
        tempDirection = 'rtl';
      } else {
        tempDirection = 'ltr';
      }
      const dialogRef = this.dialog.open(GenerateReportComponent, {
        data: {
          registration: testDetail,
          action: 'view',
        },
        direction: tempDirection,
        height: '100%',
        width: '100%',
        maxWidth: "100%",
        maxHeight: "100%"
      });
    }
  }

  loadPrescription($event: any) {
    this.showPrescription = false;
    if ($event) {
      let data = {
        "appointmentId": this.appointment.id,
        "hospitalId": this.hospitalId
      }
      this.prescriptionService?.getPrescription(data).pipe(
        catchError(() => {
          this.openSnackBar('Error occurred to get Prescription');
          return '';
        })
      ).subscribe((res: any) => {
        this.presdcriptionData = res.data;
        this.showPrescription = true;
      });
    }
  }


  AfterloadPrescription($event: any) {
    this.showAfterPrescription = false;
    if ($event) {
      let data = {
        "appointmentId": this.appointment.id,
        "hospitalId": this.hospitalId
      }
      this.afterPrescriptionService?.getAfterPrescription(data).pipe(
        catchError(() => {
          this.openSnackBar('Error occurred to get Prescription');
          return '';
        })
      ).subscribe((res: any) => {
        this.afterPrescriptionData = res.data;
        this.showAfterPrescription = true;
      });
    }
  }

  getOPeration() {
          const data = new GNoteTemplate();
          // data.status = 'Active';
          this.dropDownService.operationCombo(data).subscribe((result: any) => {
            this.operations$ = result.data;
       
          });
        } 

  loadAppoinmentLabServiceDetails($event: boolean) {
    if ($event) {
      let data = {
        "appointmentId": this.appointment?.id,
        "type": "T",
        "labNoGenerated": "N"
      }
      this.appointmentLabServices = [];
      this.masterService?.getAppoinmentServiceDetails(data).subscribe((res: any) => {
        this.appointmentLabServices = res.data;
      });
    }
  }

  loadAppoinmentXrayServiceDetails($event: boolean) {
    if ($event) {
      let data = {
        "appointmentId": this.appointment?.id,
         "type": "X",
         "labNoGenerated": "N"
      }
      this.appointmentXrayServices = [];
      this.masterService?.getAppoinmentServiceDetails(data).subscribe((res: any) => {
        this.appointmentXrayServices = res.data;
      });
    }
  }

  createBedFacilityForm(){
    return this.fb.group({
      id: [ this.bedFacilityData ? this.bedFacilityData.id : null],
      appointmentId: [this.appointment?.id],
      bedId: [this.bed?.id],
      hospitalId: [this.hospitalId],
      bedsheet: [this.bedFacilityData?.bedsheet == 1 ? true : false],
      blanket: [this.bedFacilityData?.blanket == 1 ? true : false],
      pillow: [this.bedFacilityData?.pillow == 1 ? true : false],
      pillowCover: [this.bedFacilityData?.pillowCover == 1 ? true : false],
      mattress: [this.bedFacilityData?.mattress == 1 ? true : false],
      rubberSheet: [this.bedFacilityData?.rubberSheet == 1 ? true : false],
      kidneyTray: [this.bedFacilityData?.kidneyTray == 1 ? true : false],
      urineTray: [this.bedFacilityData?.urineTray == 1 ? true : false],
      bedPan: [this.bedFacilityData?.bedPan == 1 ? true : false],
      bedsheetReturned: [this.bedFacilityData?.bedsheetReturned == 1 ? true : false],
      blanketReturned: [this.bedFacilityData?.blanketReturned == 1 ? true : false],
      pillowReturned: [this.bedFacilityData?.pillowReturned == 1 ? true : false],
      pillowCoverReturned: [this.bedFacilityData?.pillowCoverReturned == 1 ? true : false],
      mattressReturned: [this.bedFacilityData?.mattressReturned == 1 ? true : false],
      rubberSheetReturned: [this.bedFacilityData?.rubberSheetReturned == 1 ? true : false],
      kidneyTrayReturned: [this.bedFacilityData?.kidneyTrayReturned == 1 ? true : false],
      urineTrayReturned: [this.bedFacilityData?.urineTrayReturned == 1 ? true : false],
      bedPanReturned: [this.bedFacilityData?.bedPanReturned == 1 ? true : false],
    });
  }

  createNursingAssessmentForm() {
    return this.fb.group({
      id: [this.nursingAssessmentData ? this.nursingAssessmentData.id : null],
      appointmentId: [this.appointment?.id],
      bedId: [this.bed?.id],
      hospitalId: [this.hospitalId],
      arrivedBy: [this.nursingAssessmentData?.arrivedBy ?? null],
      height: [this.nursingAssessmentData?.height ?? null],
      bmi: [this.nursingAssessmentData?.bmi ?? null],
      levelOfConciousness: [this.nursingAssessmentData?.levelOfConciousness ?? null],
      medicalPastHistory: [this.nursingAssessmentData?.medicalPastHistory ?? null],
      surgicalPastHistory: [this.nursingAssessmentData?.surgicalPastHistory ?? null],
      bowelAssessment: [this.nursingAssessmentData?.bowelAssessment ?? null],
      bladderAssessment: [this.nursingAssessmentData?.bladderAssessment ?? null],
      historyOfAllergy: [this.nursingAssessmentData?.historyOfAllergy ?? null],
      ifOnAnyMedication: [this.nursingAssessmentData?.ifOnAnyMedication ?? null],
      pressureSore: [this.nursingAssessmentData?.pressureSore ?? null],
      pressureSoreLocation: [this.nursingAssessmentData?.pressureSoreLocation ?? null],
      pressureSoreAnyDeformities: [this.nursingAssessmentData?.pressureSoreAnyDeformities ?? null],
      dentures: [this.nursingAssessmentData?.dentures ?? null],
      contactLens: [this.nursingAssessmentData?.contactLens ?? null],
      artificialLimbs: [this.nursingAssessmentData?.artificialLimbs ?? null],
      implants: [this.nursingAssessmentData?.implants ?? null],
      onTubes: [this.nursingAssessmentData?.onTubes ?? null],
      fistula: [this.nursingAssessmentData?.fistula ?? null],
      colostomy: [this.nursingAssessmentData?.colostomy ?? null],
      nephrostomy: [this.nursingAssessmentData?.nephrostomy ?? null],
      nutrition: [this.nursingAssessmentData?.nutrition ?? null],
      otherDetails: [this.nursingAssessmentData?.otherDetails ?? null],
      riskOfFail: [this.nursingAssessmentData?.riskOfFail ?? null],
      painScore: [this.nursingAssessmentData?.painScore ?? null],
    });
  }

  createVitalsForm(){
    return this.fb.group({
      id: [],
      measureTime: [new Date()],
      appointmentId: [this.appointment?.id],
      pulse: [],
      rr: [],
      bp: [],
      temperature: [],
      hr: [],
      spo2: [],
      fhs: [],
      hospitalId: [this.hospitalId],
      abdGrith: [],
      weight: [],
      others: []
    });
  }

  createContinuationForm(){
    return this.fb.group({
      id: [],
      noteTime: [new Date()],
      appointmentId: [this.appointment?.id],
      clinicalNotes: [],
      advise: [],
      hospitalId: [this.hospitalId],
    });
  }

  createMedicationForm(){
    return this.fb.group({
      id: [],
      medicationDate: [new Date()],
      appointmentId: [this.appointment?.id],
      medication: [],
      dose: [],
      route: [],
      frequency: [],
      hospitalId: [this.hospitalId],
    });
  }
  
  
  removeLabTests(){
    if(this.bedFacilityForm?.get('labServices').value == false){
      this.appointmentLabServices = [];
    }
  }

  removeXrayTests(){
    if(this.bedFacilityForm?.get('xrayServices').value == false){
      this.appointmentXrayServices = [];
    }
  }

  addItem(): void {
    if(this.bedFacilityForm?.get('examinations').value == false){
      let items = this.bedFacilityForm?.get('casualityDetailList') as FormArray;
      for(let index = items.length; index >= 0; index--){
        this.removeItem(index);
      }
    }else{
      let items = this.bedFacilityForm?.get('casualityDetailList') as FormArray;
      items.push(this.createItem(null, null, null, null));
    }
  }

  removeItem(index: number){
    let items = this.bedFacilityForm?.get('casualityDetailList') as FormArray;
    items.removeAt(index);
  }

  createItem(id: any, casualtyId: any, note: any, noteDescription: any ): FormGroup {
    return this.formBuilder.group({
      id: [id],
      casualtyId: [casualtyId],
      note: [note],
      noteDescription: [noteDescription],
    });
  }

  // createPaymentForm(){
  //   return this.fb.group({
  //     id: [ this.paymentData ? this.paymentData.id : null],
  //     patientId: [this.patientId],
  //     appointmentId: [this.appointmentId, Validators.required],
  //     description: [this.paymentData?.description ?? null, Validators.required],
  //     amount: [this.paymentData?.amount ?? null, Validators.required],
  //     paymentStatus: ['UNPAID']
  //   });
  // }

  createPaymentForm() {
    return this.fb.group({
      id: [this.paymentData ? this.paymentData.id : null],
      patientId: [this.patientId],
      appointmentId: [this.appointmentId , Validators.required],
      description:[this.paymentData ? this.paymentData.description:'',Validators.required] ,
      amount: [this.paymentData? this.paymentData.amount:'', Validators.required],
      paymentStatus: ['UNPAID'],
      bedId: [this.bed?.id || '']
    });
  }


  loadAppoinments(patientId: any) {
    let postAppointments = {
      "patientId": patientId,
      "hospitalId": this.hospitalId,
      statuses: ['Completed']
    }
    this.appointmentService?.getAllAppoinment(postAppointments).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Appointments');
        return '';
      })
    ).subscribe((res: any) => {
      if(res.data?.length == 0){
        this.noHistory = true;
      }
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  loadVitals() {
    let data = {
      "appointmentId": this.appointment.id,
      "hospitalId": this.hospitalId
    }
    this.appointmentService?.getVitals(data).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Vitals');
        return '';
      })
    ).subscribe((res: any) => {
      this.vitalDataSource = new MatTableDataSource(res.data);
      this.vitalDataSource.paginator = this.paginator;
    });
  }

  loadContinuations() {
    let data = {
      "appointmentId": this.appointment.id,
      "hospitalId": this.hospitalId
    }
    this.appointmentService?.getContinuations(data).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Continuations');
        return '';
      })
    ).subscribe((res: any) => {
      this.continuationsDataSource = new MatTableDataSource(res.data);
      this.continuationsDataSource.paginator = this.paginator;
    });
  }

  loadMedications() {
    let data = {
      "appointmentId": this.appointment.id,
      "hospitalId": this.hospitalId
    }
    this.appointmentService?.getMedications(data).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Medications');
        return '';
      })
    ).subscribe((res: any) => {
      this.medicationsDataSource = new MatTableDataSource(res.data);
      this.medicationsDataSource.paginator = this.paginator;
    });
  }
  
  loadBedFacility() {
    let data = {
      "bedId": this.bed?.id,
      "hospitalId": this.hospitalId,
      "appointmentId": this.appointment?.id
    }
    this.appointmentService?.getBedFacility(data).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Bed Facility');
        return '';
      })
    ).subscribe((res: any) => {
      this.bedFacilityData = res.data[0] ?? null;
      this.bedFacilityForm?.get('id').patchValue(this.bedFacilityData?.id);
      this.bedFacilityForm?.get('appointmentId').patchValue(this.bedFacilityData?.appointmentId);
      this.bedFacilityForm?.get('bedId').patchValue(this.bedFacilityData?.bedId);
      this.bedFacilityForm?.get('bedsheet').patchValue(this.bedFacilityData?.bedsheet == 1 ? true : false);
      this.bedFacilityForm?.get('blanket').patchValue(this.bedFacilityData?.blanket == 1 ? true : false);
      this.bedFacilityForm?.get('pillow').patchValue(this.bedFacilityData?.pillow == 1 ? true : false);
      this.bedFacilityForm?.get('pillowCover').patchValue(this.bedFacilityData?.pillowCover == 1 ? true : false);
      this.bedFacilityForm?.get('mattress').patchValue(this.bedFacilityData?.mattress == 1 ? true : false);
      this.bedFacilityForm?.get('rubberSheet').patchValue(this.bedFacilityData?.rubberSheet == 1 ? true : false);
      this.bedFacilityForm?.get('kidneyTray').patchValue(this.bedFacilityData?.kidneyTray == 1 ? true : false);
      this.bedFacilityForm?.get('urineTray').patchValue(this.bedFacilityData?.urineTray == 1 ? true : false);
      this.bedFacilityForm?.get('bedPan').patchValue(this.bedFacilityData?.bedPan == 1 ? true : false);
      this.bedFacilityForm?.get('bedsheetReturned').patchValue(this.bedFacilityData?.bedsheetReturned == 1 ? true : false);
      this.bedFacilityForm?.get('blanketReturned').patchValue(this.bedFacilityData?.blanketReturned == 1 ? true : false);
      this.bedFacilityForm?.get('pillowReturned').patchValue(this.bedFacilityData?.pillowReturned == 1 ? true : false);
      this.bedFacilityForm?.get('pillowCoverReturned').patchValue(this.bedFacilityData?.pillowCoverReturned == 1 ? true : false);
      this.bedFacilityForm?.get('mattressReturned').patchValue(this.bedFacilityData?.mattressReturned == 1 ? true : false);
      this.bedFacilityForm?.get('rubberSheetReturned').patchValue(this.bedFacilityData?.rubberSheetReturned == 1 ? true : false);
      this.bedFacilityForm?.get('kidneyTrayReturned').patchValue(this.bedFacilityData?.kidneyTrayReturned == 1 ? true : false);
      this.bedFacilityForm?.get('urineTrayReturned').patchValue(this.bedFacilityData?.urineTrayReturned == 1 ? true : false);
      this.bedFacilityForm?.get('bedPanReturned').patchValue(this.bedFacilityData?.bedPanReturned == 1 ? true : false);
    });
  }

  loadNursingAssessment() {
    let data = {
      "appointmentId": this.appointment?.id,
      "hospitalId": this.hospitalId
    }
    this.appointmentService?.getNursingAssessment(data).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Bed Facility');
        return '';
      })
    ).subscribe((res: any) => {
      this.nursingAssessmentData = res.data[0] ?? null;
      this.nursingAssessmentForm?.get('id').patchValue(this.nursingAssessmentData?.id);
      this.nursingAssessmentForm?.get('appointmentId').patchValue(this.appointment?.id);
      this.nursingAssessmentForm?.get('bedId').patchValue(this.bed?.id);
      this.nursingAssessmentForm?.get('hospitalId').patchValue(this.hospitalId);
      this.nursingAssessmentForm?.get('arrivedBy').patchValue(this.nursingAssessmentData?.arrivedBy);
      this.nursingAssessmentForm?.get('height').patchValue(this.nursingAssessmentData?.height);
      this.nursingAssessmentForm?.get('bmi').patchValue(this.nursingAssessmentData?.bmi);
      this.nursingAssessmentForm?.get('levelOfConciousness').patchValue(this.nursingAssessmentData?.levelOfConciousness);
      this.nursingAssessmentForm?.get('medicalPastHistory').patchValue(this.nursingAssessmentData?.medicalPastHistory);
      this.nursingAssessmentForm?.get('surgicalPastHistory').patchValue(this.nursingAssessmentData?.surgicalPastHistory);
      this.nursingAssessmentForm?.get('bowelAssessment').patchValue(this.nursingAssessmentData?.bowelAssessment);
      this.nursingAssessmentForm?.get('bladderAssessment').patchValue(this.nursingAssessmentData?.bladderAssessment);
      this.nursingAssessmentForm?.get('historyOfAllergy').patchValue(this.nursingAssessmentData?.historyOfAllergy);
      this.nursingAssessmentForm?.get('ifOnAnyMedication').patchValue(this.nursingAssessmentData?.ifOnAnyMedication);
      this.nursingAssessmentForm?.get('pressureSore').patchValue(this.nursingAssessmentData?.pressureSore);
      this.nursingAssessmentForm?.get('pressureSoreLocation').patchValue(this.nursingAssessmentData?.pressureSoreLocation);
      this.nursingAssessmentForm?.get('pressureSoreAnyDeformities').patchValue(this.nursingAssessmentData?.pressureSoreAnyDeformities);
      this.nursingAssessmentForm?.get('dentures').patchValue(this.nursingAssessmentData?.dentures);
      this.nursingAssessmentForm?.get('contactLens').patchValue(this.nursingAssessmentData?.contactLens);
      this.nursingAssessmentForm?.get('artificialLimbs').patchValue(this.nursingAssessmentData?.artificialLimbs);
      this.nursingAssessmentForm?.get('implants').patchValue(this.nursingAssessmentData?.implants);
      this.nursingAssessmentForm?.get('onTubes').patchValue(this.nursingAssessmentData?.onTubes);
      this.nursingAssessmentForm?.get('fistula').patchValue(this.nursingAssessmentData?.fistula);
      this.nursingAssessmentForm?.get('colostomy').patchValue(this.nursingAssessmentData?.colostomy);
      this.nursingAssessmentForm?.get('nephrostomy').patchValue(this.nursingAssessmentData?.nephrostomy);
      this.nursingAssessmentForm?.get('nutrition').patchValue(this.nursingAssessmentData?.nutrition);
      this.nursingAssessmentForm?.get('otherDetails').patchValue(this.nursingAssessmentData?.otherDetails);
      this.nursingAssessmentForm?.get('riskOfFail').patchValue(this.nursingAssessmentData?.riskOfFail);
      this.nursingAssessmentForm?.get('painScore').patchValue(this.nursingAssessmentData?.painScore);
    });
  }

  loadDischargeSummary() {
    let data = {
      "appointmentId": this.appointment?.id,
      "hospitalId": this.hospitalId
    }
    this.appointmentService?.getDischargeSummary(data).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Bed Facility');
        return '';
      })
    ).subscribe((res: any) => {
      this.dischargeSummaryData = res.data[0] ?? null;
      this.dischargeSummaryForm?.get('id').patchValue(this.dischargeSummaryData?.id);
      this.dischargeSummaryForm?.get('appointmentId').patchValue(this.appointment?.id);
      this.dischargeSummaryForm?.get('bedId').patchValue(this.bed?.id);
      this.dischargeSummaryForm?.get('hospitalId').patchValue(this.hospitalId);
      this.dischargeSummaryForm?.get('summaryOfInvestigation').patchValue(this.dischargeSummaryData?.summaryOfInvestigation);
      this.dischargeSummaryForm?.get('courseOfHospitalInv').patchValue(this.dischargeSummaryData?.courseOfHospitalInv);
      this.dischargeSummaryForm?.get('treatmentGiven').patchValue(this.dischargeSummaryData?.treatmentGiven);
      this.dischargeSummaryForm?.get('conditionDischargeTime').patchValue(this.dischargeSummaryData?.conditionDischargeTime);
      this.dischargeSummaryForm?.get('adviseDischargeTime').patchValue(this.dischargeSummaryData?.adviseDischargeTime);
      this.dischargeSummaryForm?.get('emergencyAfterDischarge').patchValue(this.dischargeSummaryData?.emergencyAfterDischarge);
      this.dischargeSummaryForm?.get('followupDate').patchValue(this.dischargeSummaryData?.followupDate);
      this.dischargeSummaryForm?.get('produre').patchValue(this.dischargeSummaryData?.produre);
    });
  }

  // loadPayment(){
  //   let data = {
  //     "appointmentId": this.appointment?.id,
  //     "hospitalId": this.hospitalId,
  //     "paymentStatus": 'UNPAID',
  //     "isServicePayment": false
  //   }
  //   this.paymentService?.getPayments(data).pipe(
  //     catchError(() => {
  //       this.openSnackBar('Error occurred to get Payment');
  //       return '';
  //     })
  //   ).subscribe((res: any) => {
  //     console.log('Payment Data:', res);
  //     this.paymentData = res.data[0] ?? null;
  //     this.paymentForm = this.createPaymentForm();
  //     console.log('Payment Data Source:', this.paymentData.value);
  //   });
  // }

  loadPayment() {
  if (!this.appointment?.id || !this.hospitalId) {
    console.warn('Missing appointmentId or hospitalId');
    return;
  }

  const data = {
    appointmentId: this.appointment.id,
    hospitalId: this.hospitalId,
    paymentStatus: 'UNPAID',
    isServicePayment: false
  };

  this.paymentService.getPayments(data).pipe(
    catchError((err) => {
      this.openSnackBar('Error occurred to get Payment');
      console.error('Payment fetch error:', err);
      return of(null);
    })
  ).subscribe((res: any) => {
  this.paymentDataSource = res.data;
  this.paymentForm = this.createPaymentForm();

  console.log('Form after load:',this.paymentDataSource);
  });
}


  

  
  savePayment() {
    this.paymentForm.patchValue('appointmentId', this.appointment?.id);
    this.paymentForm.patchValue('bedId', this.bed?.id);
    this.paymentService.makePayment(this.paymentForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
      this.loadPayment();
      this.paymentForm?.get('description').patchValue('description');
      this.paymentForm?.get('amount').patchValue('amount');
      this.openSnackBar(result['message']);
    })
  }

 
   

  saveBedFacility() {
    let bedFacility = {
      id: this.bedFacilityForm?.get('id')?.value,
      appointmentId: this.appointment?.id,
      bedId: this.bed?.id,
      bedsheet: this.bedFacilityForm?.get('bedsheet')?.value == true ? 1 : 0,
      blanket: this.bedFacilityForm?.get('blanket')?.value == true ? 1 : 0,
      pillow: this.bedFacilityForm?.get('pillow')?.value == true ? 1 : 0,
      pillowCover: this.bedFacilityForm?.get('pillowCover')?.value == true ? 1 : 0,
      mattress: this.bedFacilityForm?.get('mattress')?.value == true ? 1 : 0,
      rubberSheet: this.bedFacilityForm?.get('rubberSheet')?.value == true ? 1 : 0,
      kidneyTray: this.bedFacilityForm?.get('kidneyTray')?.value == true ? 1 : 0,
      urineTray: this.bedFacilityForm?.get('urineTray')?.value == true ? 1 : 0,
      bedPan: this.bedFacilityForm?.get('bedPan')?.value == true ? 1 : 0,
      bedsheetReturned: this.bedFacilityForm?.get('bedsheetReturned')?.value == true ? 1 : 0,
      blanketReturned: this.bedFacilityForm?.get('blanketReturned')?.value == true ? 1 : 0,
      pillowReturned: this.bedFacilityForm?.get('pillowReturned')?.value == true ? 1 : 0,
      pillowCoverReturned: this.bedFacilityForm?.get('pillowCoverReturned')?.value == true ? 1 : 0,
      mattressReturned: this.bedFacilityForm?.get('mattressReturned')?.value == true ? 1 : 0,
      rubberSheetReturned: this.bedFacilityForm?.get('rubberSheetReturned')?.value == true ? 1 : 0,
      kidneyTrayReturned: this.bedFacilityForm?.get('kidneyTrayReturned')?.value == true ? 1 : 0,
      urineTrayReturned: this.bedFacilityForm?.get('urineTrayReturned')?.value == true ? 1 : 0,
      bedPanReturned: this.bedFacilityForm?.get('bedPanReturned')?.value == true ? 1 : 0,
    };

    this.appointmentService.saveBedFacility(bedFacility).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
        this.openSnackBar(result['message']);
    })
  }

  onOperationSelect(selectedId: number): void {
  if (selectedId) {
    this.masterService.getProcedureById(selectedId).subscribe({
      next: (res: any) => {
        this.selectedProcedureOp = res?.data?.procedure_op || '';
        console.log("Selected Procedure Op:", this.selectedProcedureOp);
        // this.casualtyForm.patchValue({
        //   procedureOp: procedureOp
        // });
      },
      error: (err) => {
        console.error("Error fetching procedure:", err);
        this.selectedProcedureOp = '';
        // this.casualtyForm.patchValue({
        //   procedureOp: ''
        // });
      }
    });
  }
}

  saveNursingAssessment() {
    this.nursingAssessmentForm.patchValue('appointmentId', this.appointment?.id);
    this.nursingAssessmentForm.patchValue('bedId', this.bed?.id);
    this.appointmentService.saveNursingAssessment(this.nursingAssessmentForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
        this.openSnackBar(result['message']);
    })
  }

  // saveVitals() {
  //   this.vitalsForm.patchValue('appointmentId', this.appointment?.id);
  //   this.vitalsForm.patchValue('bedId', this.bed?.id);
  //   this.appointmentService.saveVitals(this.vitalsForm.value).pipe(
  //     catchError(() => {
  //       this.openSnackBar('Error occurred to add');
  //       return '';
  //     })
  //   ).subscribe((result: any) => {
  //     this.loadVitals();
  //     this.vitalsForm = this.createVitalsForm();
  //     this.openSnackBar(result['message']);
  //   })
  // }
  
  saveVitals() {
  this.vitalsForm.patchValue({
    appointmentId: this.appointment?.id,
    bedId: this.bed?.id
  });

  this.appointmentService.saveVitals(this.vitalsForm.value).pipe(
    catchError(() => {
      this.openSnackBar('Error occurred to add');
      return of(null); // Correct way to handle observable errors
    })
  ).subscribe((result: any) => {
    if (result) {
      this.openSnackBar(result['message']);
      const vitalsData = this.vitalsForm.value;

      // Reset form if needed
      this.vitalsForm = this.createVitalsForm();

      // Navigate to next component with vitals
      this.router.navigate(['//doctor/print-discharge-summary'], {
        state: { vitals: vitalsData }
      });
    }
  });
}

  saveContinuation() {
    this.continuationForm.patchValue('appointmentId', this.appointment?.id);
    this.continuationForm.patchValue('bedId', this.bed?.id);
    this.appointmentService.saveContinuation(this.continuationForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
      this.loadContinuations();
      this.continuationForm = this.createContinuationForm();
      this.openSnackBar(result['message']);
    })
  }

  saveMedication() {
    this.medicationForm.patchValue('appointmentId', this.appointment?.id);
    this.medicationForm.patchValue('bedId', this.bed?.id);
    this.appointmentService.saveMedication(this.medicationForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
      this.loadMedications();
      this.medicationForm = this.createMedicationForm();
      this.openSnackBar(result['message']);
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  calculateAge(dob : Date){
    if(dob){
      return moment().diff(dob, 'years');
    }else{
      return 0;
    }
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.appointment?.id],
      firstName: [this.appointment?.firstName],
      lastName: [this.appointment?.lastName],
      appointmentDate: [
        formatDate(this.appointment?.appointmentDate ? this.appointment?.appointmentDate : new Date(), 'yyyy-MM-dd hh:mm', 'en'),
        [Validators.required],
      ],
      mobileNumber: [this.appointment?.mobileNumber, [Validators.required]],
      disease: [this.appointment?.disease],
      specialInstruction: [this.appointment?.specialInstruction]
    });
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmComplete() {
    this.appointment.status = 'Completed';
    this.appointmentService.updateAppoinment(this.appointment).subscribe((res: any) => {
      this.dialogRef.close();
      this.router.navigate(['/doctor/completed-appointments']);
    })
  }

  completeAndOpenIPDAssessment() {
    this.appointment.status = 'Completed';
    this.appointmentService.updateAppoinment(this.appointment).subscribe((res: any) => {
      this.dialogRef.close();
      this.router.navigate(['/doctor/initial-clinical-assessment'], { queryParams: { data: this.appointment } });
    })
  }

  printPrescription(row:any){
    let tempDirection: Direction;
    if (localStorage?.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialogRef.close();
    this.dialog.open(PrintPrescriptionComponent, {
      id: 'Print',
      data: {
        id:row.id,
        appoinment:row
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    });
  }

}
