import { HttpClient } from '@angular/common/http';
import { Component, Inject, Optional } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Employee } from 'app/admin/employees/allemployees/employees.model';
import { Services } from 'app/admin/model/services.model';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { catchError } from 'rxjs';
import { NgClass, CommonModule } from '@angular/common';
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
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { ServiceRateService } from 'app/admin/service/servicerate.service';
import { ServiceRate } from 'app/admin/model/servicerate.model';
import { PaymentsService } from '../payments.service';
import { Direction } from '@angular/cdk/bidi';
import { PrintPaymentReceiptComponent } from '../print-payment-receipt/print-payment-receipt.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Payment } from '../todays-payments/Payment.model';
import { MasterService } from 'app/admin/service/master.service';
import { AdditionalServiceComponent } from 'app/doctor/opd/appointments/additional-service/additional-service.component';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';


export interface DialogData {
  id: number;
  action: string;
  appointments: Appointments;
}

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrl: './make-payment.component.scss',
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
    AdditionalServiceComponent
  ],
})
export class MakePaymentComponent extends UnsubscribeOnDestroyAdapter {
  paymentForm: UntypedFormGroup;
  casualtyForm: any
  hide3 = true;
  agree3 = false;
  isDisabled = true;

  appointments?: Appointments;

  seachExisting = false;
  doctors$: any;
  services$: any;
  hospitalId = 0;
  appointmentId = -1;
  appointment!: Appointments;
  payment!: Payment;
  panleTitle = 'Make Payment';

  isPartialPayment = false;
  appoinmentPayment: any[] = [];
  appoinmentServices: any[] = [];
  isSubmitting = false;

  showServices = false;
  labServices = false;
  xrayServices = false;
  sonoServices = false;
  patientId: number = 0;
  newlyAddedServices: any[] = [];




  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public paymentService: PaymentsService,
    public serviceRateService: ServiceRateService,
    public appointmentsService: AppointmentsService,

    public masterService: MasterService,
    private router: Router,
    public dialog: MatDialog,
    public dropDownService: DropdownService
  ) {
    super();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    this.hospitalId = currentUser.hospitalId;
    // this.patientId = data.appointments.patientId;
    this.paymentForm = this.fb.group({
      appointmentId: [null],
      firstName: [''],
      lastName: [''],
      gender: [''],
      type: [''],
      address: [''],
      dob: [''],
      doctorId: [''],
      serviceId: [''],
      appointmentDate: [new Date()],
      patientId: [''],
      status: ['Waiting'],
      hospitalId: [this.hospitalId],
      transactionNumber: [''],
      paymentMode: [''],
      amount: [],
      cashAmount: [0],
      onlineAmount: [0],
      description: [],
      paymentStatus: ['PAID'],
      appointmentServiceList: [],
      labServices: [false],
      xrayServices: [false],
      sonoServices: [false],
    });
  }



  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      // ===== EDIT PAYMENT FLOW =====
      if (params['payment']) {
        this.payment = JSON.parse(params['payment']);
        this.populatePayment();

        if (this.payment?.appointmentId) {
          this.loadAppointmentFromPayment(this.payment.appointmentId);
        }
        return;
      }

      // ===== NEW PAYMENT FLOW =====
      if (params['appointment']) {
        this.appointment = JSON.parse(params['appointment']);
        this.appointmentId = this.appointment.id;
        this.patientId = this.appointment.patientId;

        this.populateAppointment();

        this.loadAppoinmentLabServiceDetails(true);
        this.loadAppoinmentXrayServiceDetails(true);
        this.loadAppoinmentSonographyServiceDetails(true);
      }
    });

    this.getDoctors();
    this.getServices();
  }




  // ngOnInit(): void {

  //   this.route.queryParams.subscribe(params => {

  //   /* ================= EDIT PAYMENT FLOW ================= */
  //   if (params['payment']) {
  //     this.payment = JSON.parse(params['payment']);
  //     this.populatePayment();

  //     // 🔥 LOAD APPOINTMENT USING appointmentId FROM PAYMENT
  //     if (this.payment?.appointmentId) {
  //       this.loadAppointmentFromPayment(this.payment.appointmentId);
  //     }
  //     return;
  //   }

  //   /* ================= NEW PAYMENT FLOW ================= */
  //   if (params['appointment']) {
  //     this.appointment = JSON.parse(params['appointment']);
  //     this.appointmentId = this.appointment.id;
  //     this.patientId = this.appointment.patientId;

  //     this.populateAppointment();

  //     this.loadAppoinmentLabServiceDetails(true);
  //     this.loadAppoinmentXrayServiceDetails(true);
  //     this.loadAppoinmentSonographyServiceDetails(true);
  //   }

  // });





  //   // this.route.queryParams.subscribe(params => {
  //   //   if (params['appointment']) {
  //   //     this.appointment = JSON.parse(params['appointment']);
  //   //     this.populateAppointment();
  //   //   }
  //   //   if (params['payment']) {
  //   //     this.payment = JSON.parse(params['payment']);
  //   //     this.populatePayment();
  //   //   }
  //   // });
  //   this.getServices();
  //   this.getDoctors();
  //   this.getAmount(this.appointment?.doctorId, this.appointment?.serviceId);

  //   if (this.data?.appointments) {
  //     this.appointment = this.data.appointments;
  //     this.patientId = this.appointment.patientId;
  //     this.appointmentId = this.appointment.id;
  //     this.populateAppointment();
  //   }

  //   /* CASE 2: Opened via Route (Accountant flow) */
  //   this.route.queryParams.subscribe(params => {
  //     if (params['appointment']) {
  //       this.appointment = JSON.parse(params['appointment']);
  //       this.patientId = this.appointment.patientId;
  //       this.appointmentId = this.appointment.id;
  //       this.populateAppointment();
  //     }
  //     if (params['payment']) {
  //       this.payment = JSON.parse(params['payment']);
  //       this.populatePayment();
  //     }
  //   });

  //   this.getDoctors();
  //   this.getServices();

  //   /* 🔴 LOAD SERVICES AFTER appointmentId IS READY */
  //   if (this.appointmentId) {
  //     this.loadAppoinmentLabServiceDetails(true);
  //     this.loadAppoinmentXrayServiceDetails(true);
  //     this.loadAppoinmentSonographyServiceDetails(true);
  //   }






  // }

  onPaymentModeChange(mode: string) {
    this.isPartialPayment = mode === 'partial';
    if (this.isPartialPayment) {
      this.paymentForm.patchValue({ cashAmount: 0, onlineAmount: 0, amount: 0 });
      this.paymentForm.get('cashAmount')?.valueChanges.subscribe(() => this.updateTotalAmount());
      this.paymentForm.get('onlineAmount')?.valueChanges.subscribe(() => this.updateTotalAmount());
    } else {
      this.paymentForm.patchValue({ cashAmount: 0, onlineAmount: 0 });
    }
  }

  updateTotalAmount() {
    const cash = Number(this.paymentForm.get('cashAmount')?.value) || 0;
    const online = Number(this.paymentForm.get('onlineAmount')?.value) || 0;
    const total = cash + online;
    this.paymentForm.patchValue({ amount: total }, { emitEvent: false });
  }

  getAppoinmentPayment(appointment: number) {
    const data = { appointmentId: appointment };
    this.paymentService.getPayments(data).subscribe((result: any) => {
      this.appoinmentPayment = result.data;
      if (this.appoinmentPayment.length > 0) {
        this.getUnpaidAppoinmentServices(appointment);
      }
    });
  }

  getUnpaidAppoinmentServices(appointment: any) {
    const data = { appointmentId: appointment };
    this.masterService.getAppoinmentServiceDetails(data).subscribe((result: any) => {
      this.appoinmentServices = result.data.filter((obj: any) => obj.type !== 'S');
      let unpaidAmount = this.appoinmentServices.reduce((sum, obj: any) => sum + parseFloat(obj.charges), 0);
      this.paymentForm.get('amount')?.patchValue(unpaidAmount);
    });
  }

  getAmount(doctorId: number, serviceId: number) {
    this.serviceRateService.getServiceRateForDoctor(doctorId, serviceId, this.hospitalId).subscribe((result: any) => {
      const serviceRates: ServiceRate[] = result.data;
      this.paymentForm.get('amount')?.patchValue(serviceRates.find(obj => obj.serviceId == serviceId)?.serviceRate);
    });
  }

  getServices() {
    const data = new Services();
    data.hospitalId = this.hospitalId;
    this.dropDownService.servicesCombo(data).subscribe((result: any) => {
      this.services$ = result.data;
    });
  }

  getDoctors() {
    const data = new Employee();
    data.hospitalId = this.hospitalId;
    data.userType = 'D';
    this.dropDownService.doctorsCombo(data).subscribe((result: any) => {
      this.doctors$ = result.data;
    });
  }



  onSubmit() {

    // 🔴 HARD GUARD – MUST EXIST
    if (!this.appointment || !this.appointment.id || !this.appointment.patientId) {
      this.openSnackBar('Appointment not loaded. Please reopen payment screen.');
      this.isSubmitting = false;
      return;
    }

    // ✅ FORCE SET CORRECT IDs
    this.appointmentId = this.appointment.id;
    this.patientId = this.appointment.patientId;

    if (this.isSubmitting) return;

    if (this.paymentForm.invalid) {
      this.openSnackBar('Please fill all required fields');
      return;
    }

    this.isSubmitting = true;

    /* ================= PARTIAL PAYMENT HANDLING ================= */
    if (this.paymentForm.get('paymentMode')?.value === 'partial') {
      const cash = Number(this.paymentForm.get('cashAmount')?.value) || 0;
      const online = Number(this.paymentForm.get('onlineAmount')?.value) || 0;
      this.paymentForm.patchValue({ amount: cash + online });
    }

    const successCallback = (result: any) => {
      this.isSubmitting = false;

      if (result?.message === 'Data Saved Successfully') {
        const direction: Direction =
          localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';

        this.dialog.open(PrintPaymentReceiptComponent, {
          data: { payment: result.data },
          direction,
          height: '80%',
          width: '80%',
        }).afterClosed().subscribe(() => {
          this.router.navigate(['/accountant/todays-payments']);
        });
      }
    };

    const errorHandler = () => {
      this.isSubmitting = false;
      this.openSnackBar('Error occurred while saving payment');
      return '';
    };

    /* ============================================================
       CASE 1: NEW SERVICES ADDED → CREATE NEW PAYMENT ENTRY
       ============================================================ */
    if (this.appoinmentServices && this.appoinmentServices.length > 0) {

      const newServicePayment = {
        appointmentId: this.appointmentId,
        patientId: this.patientId,
        hospitalId: this.hospitalId,
        paymentMode: this.paymentForm.get('paymentMode')?.value,
        transactionNumber: this.paymentForm.get('transactionNumber')?.value,
        amount: this.paymentForm.get('amount')?.value,
        paymentStatus: 'PAID',

        appointmentServiceList: this.appoinmentServices.map(s => ({
          serviceId: s.serviceId,
          charges: s.charges,
          type: s.type
        }))
      };

      this.paymentService.makePayment(newServicePayment)
        .pipe(catchError(errorHandler))
        .subscribe(successCallback);

      return;
    }

    /* ============================================================
       CASE 2: EDIT EXISTING PAYMENT ONLY
       ============================================================ */
    if (this.payment) {

      const updatedPayment = {
        ...this.payment,
        paymentStatus: 'PAID',
        paymentMode: this.paymentForm.get('paymentMode')?.value,
        transactionNumber: this.paymentForm.get('transactionNumber')?.value,
        description: this.paymentForm.get('description')?.value,
        amount: this.paymentForm.get('amount')?.value
      };

      this.paymentService.makePayment(updatedPayment)
        .pipe(catchError(errorHandler))
        .subscribe(successCallback);

      return;
    }

    /* ============================================================
       CASE 3: FIRST-TIME PAYMENT (NO SERVICES)
       ============================================================ */
    this.paymentService.makePayment(this.paymentForm.value)
      .pipe(catchError(errorHandler))
      .subscribe(successCallback);
  }








  //   onSubmit() {
  //   if (this.isSubmitting) return;

  //   if (this.paymentForm.invalid) {
  //     this.openSnackBar('Please fill all required fields');
  //     return;
  //   }

  //   this.isSubmitting = true;

  //   if (this.paymentForm.get('paymentMode')?.value === 'partial') {
  //     const cash = Number(this.paymentForm.get('cashAmount')?.value) || 0;
  //     const online = Number(this.paymentForm.get('onlineAmount')?.value) || 0;
  //     this.paymentForm.patchValue({ amount: cash + online });
  //   }

  //   const callback = (result: any) => {
  //     this.isSubmitting = false;
  //     if (result['message'] === 'Data Saved Successfully') {
  //       const direction: Direction = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';
  //       this.dialog.open(PrintPaymentReceiptComponent, {
  //         data: { payment: result['data'] },
  //         direction,
  //         height: '80%',
  //         width: '80%'
  //       }).afterClosed().subscribe(() => {
  //         this.router.navigate(['/accountant/todays-payments']);
  //       });
  //     }
  //   };

  //   const errorHandler = () => {
  //     this.isSubmitting = false;
  //     this.openSnackBar('Error occurred to add');
  //     return '';
  //   };

  //   if (this.payment) {
  //     this.payment = {
  //       ...this.payment,
  //       paymentStatus: 'PAID',
  //       paymentMode: this.paymentForm.get('paymentMode')?.value,
  //       transactionNumber: this.paymentForm.get('transactionNumber')?.value
  //     };
  //     this.paymentService.makePayment(this.payment)
  //       .pipe(catchError(errorHandler))
  //       .subscribe(callback);
  //   } else {
  //     if (this.appoinmentServices.length > 0) {
  //       this.paymentForm.patchValue({ appointmentServiceList: this.appoinmentServices });
  //     }
  //     this.paymentService.makePayment(this.paymentForm.value)
  //       .pipe(catchError(errorHandler))
  //       .subscribe(callback);
  //   }
  // }

  get f() {
    return this.paymentForm.controls;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  cancel() {
    history.back();
  }

  populatePayment() {
    if (this.payment) {
      this.paymentForm.patchValue({
        appointmentId: this.payment.appointmentId,
        amount: this.payment.amount,
        description: this.payment.description
      });
    }
  }

  populateAppointment() {
    if (this.appointment) {
      this.paymentForm.patchValue({
        appointmentId: this.appointment.id,
        mobileNumber: this.appointment.mobileNumber,
        firstName: this.appointment.firstName,
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
        hospitalId: this.appointment.hospitalId
      });
    }
  }

  loadAppoinmentLabServiceDetails(checked: boolean) {
    if (!checked) {
      this.appoinmentServices = this.appoinmentServices.filter(s => s.type !== 'T');
      this.recalculateAmount();
      return;
    }

    const data = {
      appointmentId: this.appointmentId,
      type: 'T'
    };

    this.masterService.getAppoinmentServiceDetails(data).subscribe((res: any) => {
      const labServices = res.data || [];

      // remove old lab services & add fresh
      this.appoinmentServices = [
        ...this.appoinmentServices.filter(s => s.type !== 'T'),
        ...labServices
      ];

      this.recalculateAmount();
    });
  }



  loadAppoinmentXrayServiceDetails(checked: boolean) {
    if (!checked) {
      this.appoinmentServices = this.appoinmentServices.filter(s => s.type !== 'X');
      this.recalculateAmount();
      return;
    }

    const data = {
      appointmentId: this.appointmentId,
      type: 'X'
    };

    this.masterService.getAppoinmentServiceDetails(data).subscribe((res: any) => {
      const xrayServices = res.data || [];

      this.appoinmentServices = [
        ...this.appoinmentServices.filter(s => s.type !== 'X'),
        ...xrayServices
      ];

      this.recalculateAmount();
    });
  }



  loadAppoinmentSonographyServiceDetails(checked: boolean) {
    if (!checked) {
      this.appoinmentServices = this.appoinmentServices.filter(s => s.type !== 'Q');
      this.recalculateAmount();
      return;
    }

    const data = {
      appointmentId: this.appointmentId,
      type: 'Q'
    };

    this.masterService.getAppoinmentServiceDetails(data).subscribe((res: any) => {
      const sonoServices = res.data || [];

      this.appoinmentServices = [
        ...this.appoinmentServices.filter(s => s.type !== 'Q'),
        ...sonoServices
      ];

      this.recalculateAmount();
    });
  }



  recalculateAmount() {
    const total = this.appoinmentServices.reduce(
      (sum: number, s: any) => sum + Number(s.charges || 0),
      0
    );

    this.paymentForm.patchValue({ amount: total });
  }


  loadAppointmentFromPayment(appointmentId: number) {
    const payload = {
      hospitalId: this.hospitalId,
      appointmentId
    };

    this.appointmentsService.getAllAppoinment(payload)
      .subscribe((res: any) => {

        if (!res?.data || res.data.length === 0) {
          this.openSnackBar('Appointment not found');
          return;
        }

        const matchedAppointment = res.data.find(
          (a: any) => a.id === appointmentId
        );

        if (!matchedAppointment) {
          this.openSnackBar('Correct appointment not found');
          return;
        }

        this.appointment = matchedAppointment;
        this.appointmentId = matchedAppointment.id;
        this.patientId = matchedAppointment.patientId;

        this.populateAppointment();

        this.loadAppoinmentLabServiceDetails(true);
        this.loadAppoinmentXrayServiceDetails(true);
        this.loadAppoinmentSonographyServiceDetails(true);
      });
  }

















  onServiceChanged(services: any[]) {
    // Only services added from payment screen
    this.newlyAddedServices = services || [];

    const total = this.newlyAddedServices.reduce(
      (sum: number, s: any) => sum + Number(s.charges || 0),
      0
    );

    this.paymentForm.patchValue({ amount: total });
  }



}