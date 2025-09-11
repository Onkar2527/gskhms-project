import { Component, OnInit } from '@angular/core';
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
import { PatientService } from '../allpatients/patient.service';
import { Patient } from '../allpatients/patient.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Occupation } from 'app/admin/model/occupation.model';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss'],
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
    NgFor
  ],
})
export class EditPatientComponent implements OnInit{
  patientForm: any;
  patientId: any;
  occupation$: any;
  patient: Patient = new Patient();
  formdata = {
    patientId:0,
    regTimestamp: '',
    grnNumber: '',
    namePrefix: '',
    firstName: '',
    middleName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '',
    maritalStatus: '',
    occupationId: '',
    mobileNumber: '',
    altMobileNumber: '',
    email:'',
    pincode:'',
    state:'',
    district:'',
    taluka:'',
    area:'',
    address:'',
    hospitalId:0
  };
  constructor(private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    public patientService : PatientService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dropDownService : DropdownService
  ) {
   
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.patientId = params['userId']; // Access the 'id' parameter from the URL
      console.log('patientId  :', this.patientId);
      this.patientForm = this.createContactForm();
      this.getPatientInfo();
      this.getOccupation();
    });
  }

  getPatientInfo() {
    const patient = new Patient();
    patient.patientId= this.patientId; 
    this.patientService.getPatientByCriteria(patient).subscribe((resp: any) => {
      this.patient = resp.data[0];
      this.patientForm.patchValue({
        patientId:this.patient.patientId,
        regTimestamp: this.patient.regTimestamp,
        grnNumber: this.patient.grnNumber,
        namePrefix:this.patient.namePrefix,
        firstName: this.patient.firstName,
        middleName: this.patient.middleName,
        lastName: this.patient.lastName,
        fatherName: this.patient.fatherName,
        motherName:this.patient.motherName,
        dob: this.patient.dob,
        gender: this.patient.gender,
        maritalStatus: this.patient.maritalStatus,
        occupationId: this.patient.occupationId,
        mobileNumber: this.patient.mobileNumber,
        altMobileNumber: this.patient.altMobileNumber,
        email: this.patient.email,
        pincode: this.patient.pincode,
        state: this.patient.state,
        district:this.patient.district,
        taluka: this.patient.taluka,
        area: this.patient.area,
        address: this.patient.address,
        hospitalId: this.patient.hospitalId
       
      })
    });
  }
  onSubmit() {
    console.log('Form Value', this.patientForm.value);
    this.patientService.updatePatient(this.patientForm.value).subscribe((result: any) => {
      if (result['message']) {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/patients/all-patients']);
      }
      else {
        this.openSnackBar(result['message']);

      }
    })
  }
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      patientId : [this.formdata.patientId],
      regTimestamp: [this.formdata.regTimestamp],
      grnNumber:[this.formdata.grnNumber],
      namePrefix: [this.formdata.namePrefix],
      firstName: [
        this.formdata.firstName,
        [Validators.required, Validators.pattern('[a-zA-Z]+')],
      ],
      middleName:[this.formdata.middleName],
      lastName: [this.formdata.lastName],
      fatherName:[ this.formdata.fatherName],
      motherName: [this.formdata.motherName],
      dob: [this.formdata.dob, [Validators.required]],
      gender: [this.formdata.gender, [Validators.required]],
      maritalStatus:[this.formdata.maritalStatus],
      occupationId: [this.formdata.occupationId],
      mobileNumber: [this.formdata.mobileNumber, [Validators.required]],
      altMobileNumber:[this.formdata.altMobileNumber],
      email: [
        this.formdata.email,
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      pincode: [this.formdata.pincode],
      state: [this.formdata.state],
      district: [this.formdata.district],   
      taluka: [this.formdata.taluka],
      area: [this.formdata.area],
      address:[this.formdata.address],
      hospitalId:[this.formdata.hospitalId]
      //uploadFile: [this.formdata.uploadFile],
    });
  }
  cancel() {
    window.history.back();
  }

  getOccupation(){
    let data = new Occupation();
    data.status = 'Active';
    this.dropDownService.occupationCombo(data).subscribe((result: any) => {
      this.occupation$ = result.data;
      console.log("occupation combo ", this.occupation$)
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
