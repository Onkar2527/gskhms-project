import { Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { BehaviorSubject, Observable, catchError, map, merge, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../../shared';
import { Patient } from '../../../../app/admin/patients/allpatients/patient.model';
import { PatientService } from '../../../../app/admin/service/patient.service';
import { ConfigService } from '../../../config';
import { FeatherIconsComponent } from '../../../shared/components/feather-icons/feather-icons.component';
import { Services } from '../../../../app/admin/model/services.model';
import { Employee } from '../../../../app/admin/employees/allemployees/employees.model';
import { DropdownService } from '../../../../app/admin/service/dropdown.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/authentication/login.service';
import { Direction } from '@angular/cdk/bidi';
import { PrintTokenComponentComponent } from '../print-token-component/print-token-component.component';
import { MatDialog } from '@angular/material/dialog';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { DepartmentList } from 'app/admin/departments/department-list/department-list.model';
import * as moment from 'moment';
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

  filterToggle = false;
  displayedColumns = [
    'id',
    'name', 
    'firstName',
    'lastName',
    'mobileNumber',
    'address',
    'dob',
    'gender',
    'actions',
    'reg_no'
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
  panleTitle = 'Book Appointment';
  hospital_code!:string;
  currentYear!:any;
  priority!:any;
  referredBy!:string;
  appointmentTime!:Date;
  age!:string;
  isSubmitting = false;

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
      namePrefix: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: [''],
      aadharNumber: [''],
      gender: [''],
      type: ['opd'],
      address: [''],
      dob: [''],
      doctorId: [''],
      serviceId: [''],
      appointmentDate: [new Date()],
      remark: [''],
      uploadFile: [''],
      patientId: [''],
      status: ['Waiting'],
      docType:['OPD'],
      subDocType:[''],
      hospitalId: [this.hospitalId],
      maidenName: [''],
      husbandName: ['',Validators.pattern('[a-zA-Z]+')],
      abhaNumber: [''],
      fatherName: [''],
      deptId: [''],
      serviceGroupId: [''],
      priority: ['Normal'],
      referredBy: [''],
      appointmentTime:[new Date()],
      age:[''],
      ageYears: [''],
      ageMonths: [''],
      ageDays: [''],
      regNo: ['']




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

     this.bookingForm.get('dob')?.valueChanges.subscribe((dob) => {
      this.updateAgeFromDOB(dob);
    });

    this.loadNextReg();
  }



  loadNextReg() {
  this.appointmentsService.getNextRegNo().subscribe((res: any) => {
    this.bookingForm.patchValue({ regNo: res.regno });
  });
}

   updateAgeFromDOB(dob: Date | null) {
    if (dob) {
      const age = this.calculateAge(dob);
      this.bookingForm.get('age')?.setValue(age, { emitEvent: false });
    } else {
      this.bookingForm.get('age')?.setValue('', { emitEvent: false });
    }
  }
  calculateAge(dob: Date): number {
    return moment().diff(moment(dob), 'years');
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
  //  calculateAge(dob : Date){
  //      if(dob){
  //        return moment().diff(dob, 'years');
  //      }else{
  //        return 0;
  //      }
  //    }
   

   getDepartments() {
        const data = new DepartmentList();
        // data.status = 'Active';
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

  

//   onSubmit() {
//   if (this.bookingForm.invalid || this.isSubmitting) {
//     return;
//   }

//   this.isSubmitting = true;

//   if (this.appointmentId == -1) {
//     this.appointmentsService.addAppointments(this.bookingForm.value).pipe(
//       catchError(() => {
//         this.openSnackBar('Error occurred to add');
//         this.isSubmitting = false;
//         return '';
//       })
//     ).subscribe((result: any) => {
//       this.isSubmitting = false;
//       if (result['message'] === 'Data Saved Successfully') {
//         let tempDirection: Direction = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';

//         this.dialog.open(PrintTokenComponentComponent, {
//           data: { appoinment: result['data'] },
//           direction: tempDirection,
//           height: '80%',
//           width: '80%'
//         }).afterClosed().subscribe(() => {
//           this.router.navigate(['/reception/appointments/today']);
//         });

//       } else {
//         this.openSnackBar('Failed to save appointment.');
//       }
//     });
//   } else {
//     this.appointmentsService.updateAppointments(this.bookingForm.value).pipe(
//       catchError(() => {
//         this.openSnackBar('Error occurred to update');
//         this.isSubmitting = false;
//         return '';
//       })
//     ).subscribe((result: any) => {
//       this.isSubmitting = false;
//       if (result['message'] === 'Data Modified Successfully') {
//         this.openSnackBar(result['message']);
//         history.back();
//       } else {
//         this.openSnackBar(result['message']);
//       }
//     });
//   }
// }


 onSubmit() {

  console.log('form valuexxxxxxxxxxxxxxxxxxxxxxxxxxx', this.bookingForm.value);
    if (this.bookingForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;

    const formValue = this.bookingForm.value;
    const appointmentDateStr = new Date(formValue.appointmentDate).toISOString().split('T')[0];
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');

    const searchPayload = {
      hospitalId: currentUser.hospitalId,
      appointmentDate: appointmentDateStr,
      mobileNumber: formValue.mobileNumber,
    };


    this.appointmentsService.getAllAppoinment(searchPayload).subscribe((res: any) => {
      const existing = res?.data;
      console.log('list', existing);
      const isDuplicate = existing.some((a: any) =>
        a.patientId === formValue.patientId

      );
      console.log('isfound', isDuplicate);

      if (isDuplicate && this.appointmentId === -1) {
        this.openSnackBar('Appointment already exists for today!');
        this.isSubmitting = false;
        return;
      }

      const request$ = this.appointmentId === -1
        ? this.appointmentsService.addAppointments(formValue)
        : this.appointmentsService.updateAppointments(formValue);

      request$.pipe(
        catchError(() => {
          this.openSnackBar('Error during submission');
          this.isSubmitting = false;
          return of(null);
        })
      ).subscribe((result: any) => {
        this.isSubmitting = false;

        if (result?.message?.includes('Successfully')) {
          if (this.appointmentId === -1) {
            const dir = localStorage.getItem('isRtl') === 'true' ? 'rtl' : 'ltr';
            this.dialog.open(PrintTokenComponentComponent, {
              data: { appoinment: result.data },
              direction: dir,
              height: '80%',
              width: '80%',
            }).afterClosed().subscribe(() => {
              this.router.navigate(['/reception/appointments/today']);
            });
          } else {
            this.openSnackBar(result.message);
            history.back();
          }
        } else {
          this.openSnackBar('Failed to save appointment.');
        }
      });
    });
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
    this.bookingForm.get('referredBy')?.patchValue(row.referredBy);
    this.bookingForm.get('age')?.patchValue(row.age);
    this.bookingForm.get('ageYears')?.patchValue(row.ageYears);
    this.bookingForm.get('ageMonths')?.patchValue(row.ageMonths);
    this.bookingForm.get('ageDays')?.patchValue(row.ageDays);
    this.bookingForm.get('regNo')?.patchValue(row.regNo);
    
  }

 public loadData() {
  if(this.bookingForm.get('mobileNumber')?.value?.length == 10 || this.bookingForm.get('firstName')?.value?.length > 2){
      // this.bookingForm.get('namePrefix')?.patchValue(null);
      // this.bookingForm.get('regNo')?.patchValue(null);
      this.bookingForm.get('patientId')?.patchValue(null);
      // this.bookingForm.get('firstName')?.patchValue(null);
      this.bookingForm.get('aadharNumber')?.patchValue(null);
      // this.bookingForm.get('lastName')?.patchValue(null);
      // this.bookingForm.get('gender')?.patchValue('F');
      this.bookingForm.get('address')?.patchValue(null);
      this.bookingForm.get('dob')?.patchValue(null);
      this.bookingForm.get('maidenName')?.patchValue(null);
      //this.bookingForm.get('husbandName')?.patchValue(null);
      // this.bookingForm.get('abhaNumber')?.patchValue(null);
      // this.bookingForm.get('fatherName')?.patchValue(null);
      // this.bookingForm.get('referredBy')?.patchValue(null); 
      
      
      this.exampleDatabase = new PatientService(this.httpClient, this.config);
      this.exampleDatabase.getAllPatientsByMNumberFnameLname(this.bookingForm.get('mobileNumber')?.value, this.bookingForm.get('firstName')?.value).pipe(
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
          priority: this.appointment.priority,
          deptId: this.appointment.deptId,
          referredBy: this.appointment.referredBy,
          appointmentTime:this.appointment.appointmentTime,
          age:this.age,
          ageYears:this.appointment.ageYears,
         ageMonths: this.appointment.ageMonths,
         ageDays: this.appointment.ageDays,
         regNo: this.appointment.regNo


        });
    }
  }

  onPrefixChange(prefix: string) {
  switch (prefix) {
    case 'Mr':
      this.bookingForm.get('gender')?.setValue('M');
      break;
    case 'Mrs':
    case 'Miss':
      this.bookingForm.get('gender')?.setValue('F');
      break;
    default:
      this.bookingForm.get('gender')?.reset();
      break;
  }


  



}


ageDisplay: string = '';

onDobChange(dob: Date) {
  if (!dob) {
    // enable manual entry
    this.bookingForm.get('ageYears')?.enable();
    this.bookingForm.get('ageMonths')?.enable();
    this.bookingForm.get('ageDays')?.enable();
    this.bookingForm.patchValue({ ageYears: '', ageMonths: '', ageDays: '' });
    return;
  }

  const birthDate = new Date(dob);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // Patch calculated values
  this.bookingForm.patchValue({
    ageYears: years,
    ageMonths: months,
    ageDays: days
  });

  // disable manual inputs when dob is present
  this.bookingForm.get('ageYears')?.disable();
  this.bookingForm.get('ageMonths')?.disable();
  this.bookingForm.get('ageDays')?.disable();
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
