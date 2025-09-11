import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { CalendarService } from '../../calendar.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Calendar } from '../../calendar.model';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PatientService } from 'app/admin/service/patient.service';
import { DataSource } from '@angular/cdk/collections';
import { Patient } from 'app/admin/patients/allpatients/patient.model';
import { catchError, BehaviorSubject, Observable, merge, map } from 'rxjs';
import { SharedModule } from '@shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../../config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';

export interface DialogData {
  id: number;
  action: string;
  calendar: Calendar;
}

@Component({
  selector: 'app-form-dialog:not(o)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule
  ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  otRegistrationForm: UntypedFormGroup;
  otRegistration: any;
  exampleDatabase?: PatientService;
  dataSource!: ExampleDataSource;
  searchExisting = false;

  displayedColumns = [
    'name',
    'mobileNumber',
    'address',
    'dob',
    'gender',
    'actions',
  ];

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public calendarService: CalendarService,
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    private config: ConfigService,
    private _snackBar: MatSnackBar,
    public appointmentService: AppointmentsService,
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.calendar.title;
      let data1: any = {};
      const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
      data1.hospitalId = currentUser.hospitalId;
      data1.id = Number(data.calendar.id);
      this.calendarService.getOperation(data1).pipe(
        catchError(() => {
          return '';
        })
      ).subscribe((result: any) => {
        this.otRegistration = result.data[0];
        this.otRegistrationForm.patchValue({
          id: this.otRegistration?.id,
          patientId: this.otRegistration?.patientId,
          appointmentId: this.otRegistration?.appointmentId,
          inDate: this.otRegistration?.inDate,
          outDate: this.otRegistration?.outDate,
          otMasterId: this.otRegistration?.otMasterId,
          operationTypeName: this.otRegistration?.operationTypeName,
          anaesthesiaInducedBy: this.otRegistration?.anaesthesiaInducedBy,
          operatingSurgeons: this.otRegistration?.operatingSurgeons,
          implantsUsed: this.otRegistration?.implantsUsed,
          hospitalId: this.otRegistration?.hospitalId,
          namePrefix: this.otRegistration?.namePrefix,
          firstName: this.otRegistration?.firstName,
          middleName: this.otRegistration?.operationTypeName,
          lastName: this.otRegistration?.lastName,
          fatherName: this.otRegistration?.fatherName,
          dob: this.otRegistration?.dob,
          gender: this.otRegistration?.gender,
          maritalStatus: this.otRegistration?.maritalStatus,
          mobileNumber: this.otRegistration?.mobileNumber,
          aadharNumber: this.otRegistration?.aadharNumber,
          address: this.otRegistration?.address,
        });
      })
    } else {
      this.dialogTitle = 'New Operation';
      this.otRegistration = data.calendar;
    }
    this.otRegistrationForm = this.createContactForm();
  }
  
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.otRegistration?.id],
      patientId: [this.otRegistration?.patientId],
      appointmentId: [this.otRegistration?.appointmentId],
      inDate: [this.otRegistration?.inDate, [Validators.required]],
      outDate: [this.otRegistration?.outDate, [Validators.required]],
      otMasterId: [this.otRegistration?.otMasterId],
      operationTypeName: [this.otRegistration?.operationTypeName],
      anaesthesiaInducedBy: [this.otRegistration?.anaesthesiaInducedBy],
      operatingSurgeons: [this.otRegistration?.operatingSurgeons],
      implantsUsed: [this.otRegistration?.implantsUsed],
      hospitalId: [this.otRegistration?.hospitalId],
      namePrefix: [this.otRegistration?.namePrefix],
      firstName: [this.otRegistration?.firstName],
      middleName: [this.otRegistration?.operationTypeName],
      lastName: [this.otRegistration?.lastName],
      fatherName: [this.otRegistration?.fatherName],
      dob: [this.otRegistration?.dob],
      gender: [this.otRegistration?.gender],
      maritalStatus: [this.otRegistration?.maritalStatus],
      mobileNumber: [this.otRegistration?.mobileNumber],
      aadharNumber: [this.otRegistration?.aadharNumber],
      address: [this.otRegistration?.address],
    });
  }

  submit() {
    // emppty stuff
  }

  selectCell(row: any){
    let data = {
      "patientId": row?.patientId,
      "hospitalId": row?.hospitalId,
      "type": 'IPD',
      statuses: ['Confirmed']
    }
    this.appointmentService.getAllAppoinment(data).pipe(
      catchError(() => {
        return '';
      })
    ).subscribe((result: any) => {
      if (result.data.length > 0) {
        this.otRegistrationForm.get('appointmentId')?.patchValue(result.data[0].id);
      }
    })
    this.otRegistrationForm.get('namePrefix')?.patchValue(row.namePrefix);
    this.otRegistrationForm.get('patientId')?.patchValue(row.patientId);
    this.otRegistrationForm.get('firstName')?.patchValue(row.firstName);
    this.otRegistrationForm.get('middleName')?.patchValue(row.middleName);
    this.otRegistrationForm.get('aadharNumber')?.patchValue(row.aadharNumber);
    this.otRegistrationForm.get('lastName')?.patchValue(row.lastName);
    this.otRegistrationForm.get('gender')?.patchValue(row.gender);
    this.otRegistrationForm.get('address')?.patchValue(row.address);
    this.otRegistrationForm.get('dob')?.patchValue(row.dob);
    this.otRegistrationForm.get('maritalStatus')?.patchValue(row.maritalStatus);
    this.otRegistrationForm.get('mobileNumber')?.patchValue(row.mobileNumber);
  }
  
  public loadData() {
    if (this.otRegistrationForm.get('mobileNumber')?.value?.length == 10 || this.otRegistrationForm.get('firstName')?.value?.length > 2 || this.otRegistrationForm.get('lastName')?.value?.length > 2) {
      this.otRegistrationForm.get('namePrefix')?.patchValue(null);
      this.otRegistrationForm.get('patientId')?.patchValue(null);
      this.otRegistrationForm.get('aadharNumber')?.patchValue(null);
      this.otRegistrationForm.get('gender')?.patchValue('');
      this.otRegistrationForm.get('address')?.patchValue(null);
      this.otRegistrationForm.get('dob')?.patchValue(null);
      this.exampleDatabase = new PatientService(this.httpClient, this.config);
      this.exampleDatabase.getAllPatientsByMNumberFnameLname(this.otRegistrationForm.get('mobileNumber')?.value, this.otRegistrationForm.get('firstName')?.value, this.otRegistrationForm.get('lastName')?.value).pipe(
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

  deleteEvent() {
    this.calendarService.deleteCalendar(this.otRegistrationForm.getRawValue());
    this.dialogRef.close('delete');
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.calendarService.addUpdateCalendar(this.otRegistrationForm.getRawValue()).pipe(
      catchError(() => {
        this.openSnackBar('Error occurred to add');
        return '';
      })
    ).subscribe((result: any) => {
      this.dialogRef.close('submit');
      console.log('otRegistrationForm', this.otRegistrationForm.getRawValue())

    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
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