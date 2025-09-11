import { Component, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { catchError } from 'rxjs';
import { Specialization } from 'app/admin/model/specialization.model';
import { Employee } from 'app/admin/employees/allemployees/employees.model';
import { EmployeeService } from 'app/admin/employees/allemployees/employees.service';
import { Designation } from 'app/admin/model/designation.model';
import { Hospital } from 'app/admin/model/hospital.model';
import { NgFor, CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Doctor } from '../doctor.model';
@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
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
    FileUploadComponent,
    MatButtonModule,
    NgFor,
    MatCheckboxModule,
    CommonModule
  ],
})
export class AddDoctorComponent {
  @ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

  panleTitle: string = 'Add Doctor'
  employeeForm: any;
  userId: any;
  employee: any = new Doctor();
  hide3 = true;
  agree3 = false;
  departments$: any;
  designation$: any;
  specialization$: any;
  hospital$: any;
  errorMsg = '';
  successMsg = '';
  formdata = {
    employeeId: 0,
    userRegNumber: '',
    photo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    mobileNumber: '',
    altMobileNumber: '',
    gender: '',
    emailId: '',
    motherName: '',
    dob: '',
    maritalStatus: '',
    bloodGroup: '',
    designationId: 0,
    dateOfJoining: '',
    probationPeriod: '',
    confirmationDate: '',
    uanNumber: '',
    degree:'',
    currentAddress: '',
    currentArea: '',
    currentTaluka: '',
    currentDistrict: '',
    currentState: '',
    currentPincode: '',
    permanantAddress: '',
    permanentArea: '',
    permanentTaluka: '',
    permanentDistrict: '',
    permanentState: '',
    permanentPincode: '',
    password: '',
    status: '',
    mKey: '',
    wKey: '',
    appVersion: '',
    mobileToken: '',
    hospitalId: 0,
    uploadFile: '',
    education: '',
    special: 0,
    specializationId: 0,
    userType: '',
    payoutDetails: {
      id: 0,
      employeeId: 0,
      payoutType: '', //S/SI/CS/OC
      salary: '',
      incentiveBasedOn: '',
      prescriptionTemplate: '',
      prescriptionTemplateText: '',
      onCallServiceCharges: 0,
      collectionLimit: 0,
      collectionPercentage: 0,
      patientCount: 0,
      perPatientAmount: 0,
      revenuePercentageShare: 0
    }
  };
  uploadFile!: File;

  constructor(private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    public employeeService: EmployeeService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId']; // Access the 'id' parameter from the URL
    });
    const req = new Employee();
    req.employeeId = this.userId;
    if(this.userId > 0){
      this.panleTitle = 'Edit Doctor';
    }
    this.employee.employeeId = this.userId;
    this.employeeForm = this.createContactForm();
    this.getDesignation();
    this.getSpecialization();
    this.getEmployee();
    this.getHospital();
  }

  getHospital() {
    const data = new Hospital();
    data.status = 'Active';
    this.dropDownService.hospitalCombo(data).subscribe((result: any) => {
      this.hospital$ = result.data;
    });
  }

  getDesignation() {
    const data = new Designation();
    data.status = 'Active';
    this.dropDownService.designationCombo(data).subscribe((result: any) => {
      this.designation$ = result.data;
    });
  }

  getSpecialization() {
    const data = new Specialization();
    data.status = 'Active';
    this.dropDownService.specializationCombo(data).subscribe((result: any) => {
      this.specialization$ = result.data;
    });
  }

  onSubmit() {
    if(this.employeeForm.valid){
      if(this.userId > 0){                                                                                                                                                         
         // let formData = new FormData();
         const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
         this.employeeForm.hospitalId = currentUser.hospitalId;
         // if(this.fileUploadComponent){
         //   formData.append('file', this.fileUploadComponent.file);
         // }
         // formData.append('user', JSON.stringify(this.employeeForm.value));
         this.employeeService.updateEmployee(this.employeeForm.value).pipe(
           catchError(() => {
             this.openSnackBar('Error occurred to update');
             return '';
           })
         ).subscribe((result: any) => {
           this.openSnackBar(result['message']);
           this.router.navigate(['/admin/doctors/allDoctors'])
         })
      }else{
        const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
        this.employeeForm.hospitalId = currentUser.hospitalId;
        this.employeeForm.id = null;
        // let formData = new FormData();
        // if(this.fileUploadComponent){
        //   formData.append('file', this.fileUploadComponent.file);
        // }
        // formData.append('user', JSON.stringify(this.employeeForm.value));
        this.employeeService.addEmployee(this.employeeForm.value).pipe(
          catchError(() => {
            this.openSnackBar('Error occurred to add');
            return '';
          })
        ).subscribe((result: any) => {
            this.openSnackBar(result['message']);
            this.router.navigate(['/admin/doctors/allDoctors']);
        })
      }
    }
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      employeeId:[this.formdata.employeeId],
      firstName: [
        this.formdata.firstName,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      middleName:[
        this.formdata.middleName,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      lastName: [
        this.formdata.lastName,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      userRegNumber:[this.formdata.userRegNumber],
      mobileNumber: [this.formdata.mobileNumber],
      altMobileNumber:[this.formdata.altMobileNumber],
      gender: [this.formdata.gender],
      password: [this.formdata.password],
      emailId: [
        this.formdata.emailId,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      dob: [this.formdata.dob],
      motherName:[this.formdata.motherName ],
      maritalStatus:[this.formdata.maritalStatus],
      bloodGroup:[this.formdata.bloodGroup],
      probationPeriod:[this.formdata.probationPeriod],
      dateOfJoining:[this.formdata.dateOfJoining],    
      uanNumber:[this.formdata.uanNumber],
      confirmationDate:[this.formdata.confirmationDate],
      eduction:[this.formdata.education],
      currentArea:[this.formdata.currentArea],
      currentTaluka:[this.formdata.currentTaluka],
      currentDistrict:[this.formdata.currentDistrict],
      currentState:[this.formdata.currentState],
      currentPincode:[this.formdata.currentPincode],
      currentAddress:[this.formdata.currentAddress],
      permanentArea:[this.formdata.permanentArea],
      permanentTaluka:[this.formdata.permanentTaluka],
      permanentDistrict:[this.formdata.permanentDistrict],
      permanentState:[this.formdata.permanentState],
      permanentPincode:[this.formdata.permanentPincode],
      permanantAddress:[this.formdata.permanantAddress],
      designationId:[this.formdata.designationId],
      uploadFile: [this.formdata.photo],
      specializationId:[this.formdata.specializationId],
      userType: [this.formdata.userType],
      hospitalId: [this.formdata.hospitalId],
      degree: [this.formdata.degree],
      isChecked:[false],
      payoutDetails: this.fb.group({
        id: this.formdata.payoutDetails.id,
        employeeId: this.formdata.payoutDetails.employeeId,
        payoutType: this.formdata.payoutDetails.payoutType, //S/SI/CS/OC
        salary: this.formdata.payoutDetails.salary,
        incentiveBasedOn: this.formdata.payoutDetails.incentiveBasedOn,
        prescriptionTemplate: this.formdata.payoutDetails.prescriptionTemplate,
        prescriptionTemplateText: this.formdata.payoutDetails.prescriptionTemplateText,
        onCallServiceCharges: this.formdata.payoutDetails.onCallServiceCharges,
        collectionLimit: this.formdata.payoutDetails.collectionLimit,
        collectionPercentage: this.formdata.payoutDetails.collectionPercentage,
        patientCount: this.formdata.payoutDetails.patientCount,
        perPatientAmount: this.formdata.payoutDetails.perPatientAmount,
        revenuePercentageShare: this.formdata.payoutDetails.revenuePercentageShare,
      })
    });
  }

  checkValue() {
    if (this.employeeForm.value.isChecked) {
      this.employeeForm.patchValue({
        permanentArea: this.employeeForm.get('currentArea')?.value,
        permanentTaluka: this.employeeForm.get('currentTaluka')?.value,
        permanentDistrict: this.employeeForm.get('currentDistrict')?.value,
        permanentState: this.employeeForm.get('currentState')?.value,
        permanentPincode: this.employeeForm.get('currentPincode')?.value,
        permanantAddress: this.employeeForm.get('currentAddress')?.value,
      })
    } else {
      this.employeeForm.patchValue({
        permanentArea: '',
        permanentTaluka: '',
        permanentDistrict: '',
        permanentState: '',
        permanentPincode: '',
        permanantAddress: '',
      })
    }
  }

  cancel() {
    window.history.back();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  getEmployee() {
    if(this.userId > 0){
      this.employeeService.getDoctorDataById(this.userId).subscribe((resp: any) => {
        this.employee = resp.data[0];
        this.employeeForm.patchValue({
          employeeId:this.employee.employeeId,
          userRegNumber: this.employee.userRegNumber,
          photo: this.employee.photo,
          firstName: this.employee.firstName,
          middleName: this.employee.middleName,
          lastName: this.employee.lastName,
          mobileNumber: this.employee.mobileNumber,
          altMobileNumber: this.employee.altMobileNumber,
          gender: this.employee.gender,
          emailId: this.employee.emailId,
          motherName: this.employee.motherName,
          dob: this.employee.dob,
          maritalStatus: this.employee.maritalStatus,
          bloodGroup: this.employee.bloodGroup,
          designationId: this.employee.designationId,
          dateOfJoining: this.employee.dateOfJoining,
          probationPeriod: this.employee.probationPeriod,
          confirmationDate: this.employee.confirmationDate,
          uanNumber: this.employee.uanNumber,
          currentAddress: this.employee.currentAddress,
          currentArea: this.employee.currentArea,
          currentTaluka: this.employee.currentTaluka,
          currentDistrict: this.employee.currentDistrict,
          currentState: this.employee.currentState,
          currentPincode: this.employee.currentPincode,
          permanantAddress: this.employee.permanantAddress,
          permanentArea:this.employee.permanentArea,
          permanentTaluka: this.employee.currentTaluka,
          permanentDistrict: this.employee.permanentDistrict,
          permanentState: this.employee.permanentState,
          permanentPincode: this.employee.permanentPincode,
          password: this.employee.password,
          status: this.employee.status,
          hospitalId: this.employee.hospitalId ?? 0,
          uploadFile:this.employee.photo,
          education:this.employee.education,
          ischecked:[false],
          specializationId:this.employee.specializationId,
          userType: this.employee.userType,
          payoutDetails: {
            id: this.employee.payoutDetails?.id,
            employeeId: this.employee.payoutDetails?.employeeId,
            payoutType: this.employee.payoutDetails?.payoutType, //S/SI/CS/OC
            salary: this.employee.payoutDetails?.salary,
            incentiveBasedOn: this.employee.payoutDetails?.incentiveBasedOn,
            prescriptionTemplate: this.employee.payoutDetails?.prescriptionTemplate,
            prescriptionTemplateText: this.employee.payoutDetails?.prescriptionTemplateText,
            onCallServiceCharges: this.employee.payoutDetails?.onCallServiceCharges,
            collectionLimit: this.employee.payoutDetails?.collectionLimit,
            collectionPercentage: this.employee.payoutDetails?.collectionPercentage,
            patientCount: this.employee.payoutDetails?.patientCount,
            perPatientAmount: this.employee.payoutDetails?.perPatientAmount,
            revenuePercentageShare: this.employee.payoutDetails?.revenuePercentageShare
          }
        })
      });
    }
  }
}
