import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@config';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { PrescriptionService } from 'app/admin/service/prescription.service';
import { catchError } from 'rxjs';
import { LoginService } from 'app/authentication/login.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatAccordion } from '@angular/material/expansion';
import * as moment from 'moment';
import { Direction } from '@angular/cdk/bidi';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PaymentsService } from 'app/accountant/payments.service';
import { MasterService } from 'app/admin/service/master.service';
import { SharedModule } from '@shared/shared.module';
import { PrintLabReportComponent } from 'app/lab/registration/registration-list/print-lab-report/print-lab-report.component';
import { GenerateReportComponent } from 'app/lab/x-ray-registration/dialogs/generate-report/generate-report.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PharmacyService } from 'app/admin/service/pharmacy.service';
import { AdditionalServiceComponent } from 'app/doctor/opd/appointments/additional-service/additional-service.component';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { PrescriptionComponent } from 'app/doctor/ipd/prescription/prescription.component';
import { PrintOperationSummary } from '../print-operation-summary/print-operation-summary.component';
import { CalendarService } from '../registration/calendar.service';

export interface DialogData {
  otRegistration: any;
}
@Component({
  selector: 'app-attent-ot',
  standalone: true,
  templateUrl: './attent-ot.component.html',
  styleUrl: './attent-ot.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  imports: [
    SharedModule,
    PrescriptionComponent,
    AdditionalServiceComponent,
    MatProgressSpinnerModule,
    PrintOperationSummary
  ],
})
export class AttentOtComponent implements OnInit, AfterViewChecked {
  accordion = viewChild.required(MatAccordion);
  labReportFound:boolean=false;
  xrayReportFound:boolean=false;
  dialogTitle: string;
  appointmentForm: UntypedFormGroup;
  appointment!: Appointments;
  pharmacyDatabase!: PharmacyService;
  patientId: number = 0;
  appointmentId: number = 0;
  hospitalId: number = 0;
  dataSource: any = [];
  paymentDataSource: any = [];
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter?: ElementRef;

  displayedPaymentColumns = [
    'paymentDate',
    'description',
    'amount',
    'createdBy',
  ];

  operationSummaryForm: any;
  operationSummaryData: any;
  presdcriptionData: any;
  showPrescription = false;
  paymentForm: any;
  paymentData: any = null;
  otRegistration: any;

  constructor(
    public dialogRef: MatDialogRef<AttentOtComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public appointmentService: AppointmentsService,
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public config: ConfigService,
    public dropDownService: DropdownService,
    public calenderService: CalendarService,
    public loginService: LoginService,
    public dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    public paymentService: PaymentsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // Set the defaults
    this.dialogTitle = 'Operation Details';
    this.otRegistration = data.otRegistration;
    this.appointmentId = this.otRegistration.appointmentId;
    this.appointmentService?.getAllAppoinment({ id: this.appointmentId })?.subscribe((data: any) => {
      this.appointment = data.data[0] ?? data.appoinment;
      this.patientId = this.appointment?.patientId;
      if (this.patientId != 0) {
        this.loadPayment();
        this.loadOperationSummary();
        this.paymentForm = this.createPaymentForm();
        this.operationSummaryForm = this.createOperationSummaryForm();
      }
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

  createOperationSummaryForm(){
    return this.fb.group({
      id: [ this.operationSummaryData ? this.operationSummaryData.id : null],
      appointmentId: [this.appointment?.id],
      hospitalId: [this.hospitalId],
      operationId: [this.otRegistration.id],
      operationStatus: [this.operationSummaryData?.operationStatus],
      operationNote: [this.operationSummaryData?.operationNote],
      precautionaryNote: [this.operationSummaryData?.precautionaryNote],
      folloupDate: [this.operationSummaryData?.folloupDate],
      preCleaningStatus: [this.operationSummaryData?.preCleaningStatus],
      postCleaningStatus: [this.operationSummaryData?.postCleaningStatus],
    });
  }

  saveOperationSummary(){
    this.operationSummaryForm.patchValue('appointmentId', this.appointment?.id);
    this.calenderService.saveOperationSummary(this.operationSummaryForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
        this.loadOperationSummary();
        this.openSnackBar(result['message']);
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

  createPaymentForm(){
    return this.fb.group({
      id: [ this.paymentData ? this.paymentData.id : null],
      patientId: [this.patientId],
      appointmentId: [this.appointmentId, Validators.required],
      description: [this.paymentData?.description ?? null, Validators.required],
      amount: [this.paymentData?.amount ?? null, Validators.required],
      paymentStatus: ['UNPAID']
    });
  }

  loadOperationSummary() {
    let data = {
      "operationId": this.otRegistration?.id
    }
    this.calenderService?.getOperationSummary(data).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Bed Facility');
        return '';
      })
    ).subscribe((res: any) => {
      this.operationSummaryData = res.data[0] ?? null;
      this.operationSummaryForm?.get('id').patchValue(this.operationSummaryData?.id);
      this.operationSummaryForm?.get('appointmentId').patchValue(this.appointment?.id);
      this.operationSummaryForm?.get('hospitalId').patchValue(this.hospitalId);
      this.operationSummaryForm?.get('operationStatus').patchValue(this.operationSummaryData?.operationStatus);
      this.operationSummaryForm?.get('operationNote').patchValue(this.operationSummaryData?.operationNote);
      this.operationSummaryForm?.get('precautionaryNote').patchValue(this.operationSummaryData?.precautionaryNote);
      this.operationSummaryForm?.get('preCleaningStatus').patchValue(this.operationSummaryData?.preCleaningStatus);
      this.operationSummaryForm?.get('postCleaningStatus').patchValue(this.operationSummaryData?.postCleaningStatus);
      this.operationSummaryForm?.get('folloupDate').patchValue(this.operationSummaryData?.folloupDate);
    });
  }

  loadPayment(){
    let data = {
      "appointmentId": this.appointment?.id,
      "hospitalId": this.hospitalId,
      "isServicePayment": false
    }
    this.paymentService?.getPayments(data).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to get Payment');
        return '';
      })
    ).subscribe((res: any) => {
      this.paymentDataSource = res.data;
      this.paymentForm = this.createPaymentForm();
    });
  }

  savePayment() {
    this.paymentForm.patchValue('appointmentId', this.appointment?.id);
    this.paymentService.makePayment(this.paymentForm.value).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
      this.loadPayment();
      this.paymentForm?.get('description').patchValue(null);
      this.paymentForm?.get('amount').patchValue(null);
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
}
