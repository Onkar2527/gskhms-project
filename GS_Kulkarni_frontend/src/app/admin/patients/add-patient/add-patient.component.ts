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
import { PatientService } from '../allpatients/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { CommonModule, NgFor } from '@angular/common';
import { Occupation } from 'app/admin/model/occupation.model';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.scss'],
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
export class AddPatientComponent implements OnInit{
  patientForm: UntypedFormGroup;
  occupation$:any;
  constructor(private fb: UntypedFormBuilder,
    public patientService: PatientService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService

  ) {
    this.patientForm = this.fb.group({
      grnNumber:[''],
      namePrefix:[''],
      firstName: ['', [Validators.required, Validators.pattern('[a-zA-Z]+')]],
      middleName:[''],
      lastName: [''],
      fatherName:[''],
      motherName:[''],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      maritalStatus:[''],
      // occupationId:[0],
      mobileNumber: [''],
      altMobileNumber:[''],
      email: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      pincode: [''],
      state: [''],
      district: [''],
      taluka: [''],
      area: [''],
      address: [''],
      hospitalId:[0],
      //uploadFile: [''],
    });
  }
  onSubmit() {
    console.log('Form Value', this.patientForm.value);
    this.patientService.addPatient(this.patientForm.value).subscribe((result: any) => {
      if (result['message']) {
        this.openSnackBar(result['message']);
        this.router.navigate(['admin/patients/all-patients']);
      }
      else {
        this.openSnackBar(result['message']);

      }
    })
  }
  ngOnInit() {
      this.getOccupation();
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
