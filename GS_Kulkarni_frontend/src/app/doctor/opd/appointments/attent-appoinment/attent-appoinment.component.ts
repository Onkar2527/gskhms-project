import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { Appointments } from '../appointments.model';
import { PrescriptionDetail } from '../prescription-details.model';
import { Pharmacy } from '../pharmacy.model';
import { PharmacyService } from '../pharmacy.service';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@config';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { PrescriptionService } from 'app/admin/service/prescription.service';
import { AppointmentsService } from '../appointments.service';
import { catchError } from 'rxjs';
import { LoginService } from 'app/authentication/login.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PrescriptionComponent } from '../prescription/prescription.component';
import { PrintPrescriptionComponent } from '../print-prescription/print-prescription.component';
import { MatAccordion } from '@angular/material/expansion';
import * as moment from 'moment';
import { Direction } from '@angular/cdk/bidi';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaymentsService } from 'app/accountant/payments.service';
import { AdditionalServiceComponent } from '../additional-service/additional-service.component';
import { MasterService } from 'app/admin/service/master.service';
import { SharedModule } from '@shared/shared.module';
import { RegistrationService } from 'app/lab/service/registration.service';
import { PrintLabReportComponent } from 'app/lab/registration/registration-list/print-lab-report/print-lab-report.component';
import { GenerateReportComponent } from 'app/lab/x-ray-registration/dialogs/generate-report/generate-report.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface DialogData {
  id: number;
  action: string;
  appointments: Appointments;
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
    MatProgressSpinnerModule
  ],
})
export class AttentAppoinmentComponent implements OnInit, AfterViewChecked {
  accordion = viewChild.required(MatAccordion);
  labReportFound: boolean = false;
  xrayReportFound: boolean = false;
  action: string;
  dialogTitle: string;
  appointmentForm: UntypedFormGroup;
  appointment!: Appointments;
  prescriptionDetails!: PrescriptionDetail[];
  pharmacyCombo$!: Pharmacy[];
  dosesCombo$!: any;
  routeCombo$!: any;
  consumeCombo$!: any;
  quantityCombo$!: any;
  prescription!: any;
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

  casualtyForm: any;
  casualtyData: any = null;
  presdcriptionData: any;
  showPrescription = false;
  paymentForm: any;
  paymentData: any = null;
  addExamination: boolean = false;
  appointmentLabServices: any[] = [];
  appointmentXrayServices: any[] = [];
  appointmentSonographyServices: any[] = [];
  labData$: any[] = [];
  xrayData$: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AttentAppoinmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public appointmentService: AppointmentsService,
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public config: ConfigService,
    public dropDownService: DropdownService,
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
    this.appointment = data.appointments;
    this.patientId = data.appointments.patientId;
    this.appointmentId = data.appointments.id;
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
    this.patientId = this.appointment.patientId;
    if (this.patientId != 0) {
      this.casualtyForm = this.createCasulatyForm();
      this.paymentForm = this.createPaymentForm();
      this.loadPayment();
      this.loadAppoinmentLabServiceDetails(true);
      this.loadAppoinmentXrayServiceDetails(true);
       this.loadAppoinmentSonographyServiceDetails(true);
      this.loadAppoinments(this.patientId)
      this.loadPrescription(true);
      this.loadLabReportData(this.appointment.id);
      this.loadXrayReportData(this.appointment.id);
      this.loadCasualty();
     
    }
  }

  loadLabReportData(id: number) {
    let data = {
      "appointmentId": id,
      "approvalStatus": "A",
      "type": "T"
    }
    this.registrationService.getLabReport(data).subscribe((res: any) => {
      this.labData$ = res.data;
      this.labReportFound = this.labData$.length > 0;
    })
  }

  loadXrayReportData(id: number) {
    let data = {
      "appointmentId": id,
      "status": "Report Generated",
      "type": "X"
    }
    this.registrationService.getLabReport(data).subscribe((res: any) => {
      this.xrayData$ = this.labData$.concat(res.data);
      this.xrayReportFound = this.xrayData$.length > 0;
    })
  }

  printreport(type: any, id: any, testDetail: any) {
    if (type === 'T') {
      let tempDirection: Direction;
      if (localStorage.getItem('isRtl') === 'true') {
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
      if (localStorage.getItem('isRtl') === 'true') {
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
      this.prescriptionService.getPrescription(data).pipe(
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

  loadAppoinmentLabServiceDetails($event: boolean) {
    if ($event) {
      let data = {
        "appointmentId": this.appointmentId,
        "type": "T"
      }
      this.appointmentLabServices = [];
      this.masterService.getAppoinmentServiceDetails(data).subscribe((res: any) => {
        this.appointmentLabServices = res.data;
        this.casualtyForm.get('labServices').patchValue(this.appointmentLabServices.length > 0 ? true : false);
      });
    }
  }

  loadAppoinmentXrayServiceDetails($event: boolean) {
    if ($event) {
      let data = {
        "appointmentId": this.appointmentId,
        "type": "X"
      }
      this.appointmentXrayServices = [];
      this.masterService.getAppoinmentServiceDetails(data).subscribe((res: any) => {
        this.appointmentXrayServices = res.data;
        this.casualtyForm.get('xrayServices').patchValue(this.appointmentXrayServices.length > 0 ? true : false);
      });
    }
  }

  loadAppoinmentSonographyServiceDetails($event: boolean) {
    if ($event) {
      let data = {
        "appointmentId": this.appointmentId,
        "type": "Q"
      }
      this.appointmentSonographyServices = [];
      this.masterService.getAppoinmentServiceDetails(data).subscribe((res: any) => {
        this.appointmentSonographyServices = res.data;
        console.log("asch",res);
        this.casualtyForm.get('sonoServices').patchValue(this.appointmentSonographyServices.length > 0 ? true : false);
      });
    }
  }

  createCasulatyForm() {
    return this.fb.group({
      id: [this.casualtyData ? this.casualtyData.id : null],
      patientId: [this.appointment?.patientId],
      appointmentId: [this.appointmentId, Validators.required],
      chiefComplaints: [this.casualtyData?.chiefComplaints ?? null],
      history: [this.casualtyData?.history ?? null],
      trauma: [this.casualtyData?.trauma ?? null],
      medicalComorbidities: [this.casualtyData?.medicalComorbidities ?? null],
      previousTreatments: [this.casualtyData?.previousTreatments ?? null],
      casualityDetailList: new FormArray([]),
      examinations: [this.casualtyData?.casualityDetailList.length > 0 ? true : false],
      xrayServices: [this.appointmentXrayServices.length > 0 ? true : false],
      labServices: [this.appointmentLabServices.length > 0 ? true : false],
      sonoServices: [this.appointmentSonographyServices.length > 0 ? true : false]
    });
  }

  removeLabTests() {
    if (this.casualtyForm.get('labServices').value == false) {
      this.appointmentLabServices = [];
    }
  }

  removeXrayTests() {
    if (this.casualtyForm.get('xrayServices').value == false) {
      this.appointmentXrayServices = [];
    }
  }


  removeSonographyTests() {
    if (this.casualtyForm.get('sonoServices').value == false) {
      this.appointmentSonographyServices = [];
    }
  }

  addItem(): void {
    if (this.casualtyForm.get('examinations').value == false) {
      let items = this.casualtyForm.get('casualityDetailList') as FormArray;
      for (let index = items.length; index >= 0; index--) {
        this.removeItem(index);
      }
    } else {
      let items = this.casualtyForm.get('casualityDetailList') as FormArray;
      items.push(this.createItem(null, null, null, null));
    }
  }

  removeItem(index: number) {
    let items = this.casualtyForm.get('casualityDetailList') as FormArray;
    items.removeAt(index);
  }

  createItem(id: any, casualtyId: any, note: any, noteDescription: any): FormGroup {
    return this.formBuilder.group({
      id: [id],
      casualtyId: [casualtyId],
      note: [note],
      noteDescription: [noteDescription],
    });
  }

  createPaymentForm() {
    return this.fb.group({
      id: [this.paymentData ? this.paymentData.id : null],
      patientId: [this.patientId],
      appointmentId: [this.appointmentId, Validators.required],
      description: [this.paymentData?.description ?? null, Validators.required],
      amount: [this.paymentData?.amount ?? null, Validators.required],
      paymentStatus: ['UNPAID']
    });
  }

  loadAppoinments(patientId: any) {
    let postAppointments = {
      "patientId": patientId,
      "hospitalId": this.hospitalId,
      statuses: ['Completed']
    }
    this.appointmentService.getAllAppoinment(postAppointments).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Appointments');
        return '';
      })
    ).subscribe((res: any) => {
      if (res.data?.length == 0) {
        this.noHistory = true;
      }
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.paginator;
    });
  }

  loadCasualty() {
    this.showPrescription = false;
    let data = {
      "appointmentId": this.appointmentId,
      "hospitalId": this.hospitalId
    }
    this.appointmentService.getCaualty(data).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Casualty');
        return '';
      })
    ).subscribe((res: any) => {
      this.casualtyData = res.data[0] ?? null;
      this.casualtyForm.get('chiefComplaints').patchValue(this.casualtyData?.chiefComplaints);
      this.casualtyForm.get('history').patchValue(this.casualtyData?.history);
      this.casualtyForm.get('trauma').patchValue(this.casualtyData?.trauma);
      this.casualtyForm.get('medicalComorbidities').patchValue(this.casualtyData?.medicalComorbidities);
      this.casualtyForm.get('casualityDetailList').patchValue(this.casualtyData?.casualityDetailList);
      this.casualtyForm.get('examinations').patchValue(this.casualtyData?.casualityDetailList.length > 0 ? true : false);
      if (this.casualtyData?.casualityDetailList.length > 0) {
        let items = this.casualtyForm.get('casualityDetailList') as FormArray;
        for (let noteObject of this.casualtyData?.casualityDetailList) {
          items.push(this.createItem(noteObject.id, noteObject.casualtyId, noteObject.note, noteObject.noteDescription));
        }
      }
      this.showPrescription = true;
    });
  }

  loadPayment() {
    let data = {
      "appointmentId": this.appointmentId,
      "hospitalId": this.hospitalId,
      "paymentStatus": 'UNPAID',
      "isServicePayment": false
    }
    this.paymentService.getPayments(data).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Payment');
        return '';
      })
    ).subscribe((res: any) => {
      this.paymentData = res.data[0] ?? null;
      this.paymentForm = this.createPaymentForm();
      
    });
  }

  savePayment() {
    this.paymentService.makePayment(this.paymentForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
      this.openSnackBar(result['message']);
    })
  }

  saveCasualty() {
    this.appointmentService.saveCaualty(this.casualtyForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      }) 
    ).subscribe((result: any) => {
      this.openSnackBar(result['message']);
      this.appointment.status = 'Casualty Completed';
      this.appointmentService.updateAppoinment(this.appointment).subscribe((res: any) => {
        this.dialogRef.close();
        // this.router.navigate(['/doctor/casualty-appointments'])
        // history.back();
      })
    })
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  calculateAge(dob: Date) {
    return moment().diff(dob, 'years')
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.appointment.id],
      firstName: [this.appointment.firstName],
      lastName: [this.appointment.lastName],
      appointmentDate: [
        formatDate(this.appointment.appointmentDate, 'yyyy-MM-dd hh:mm', 'en'),
        [Validators.required],
      ],
      mobileNumber: [this.appointment.mobileNumber, [Validators.required]],
      disease: [this.appointment.disease],
      specialInstruction: [this.appointment.specialInstruction]
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

  printPrescription(row: any) {
    let tempDirection: Direction;
    if (localStorage?.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog.open(PrintPrescriptionComponent, {
      data: {
        id: row.id,
        appoinment: row
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    });
  }

}
