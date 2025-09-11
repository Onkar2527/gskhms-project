import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Designation } from 'app/admin/model/designation.model';
import { PatientCompany } from 'app/admin/model/patientcompany.model';
import { PatientCompanyService } from '../../patientcompany.service';
import { CommonModule, NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { MatSelectModule } from '@angular/material/select';
import { RateTye } from 'app/admin/model/rateType.model';
import { PatientsCategory } from 'app/admin/model/patientscategory.model';

export interface DialogData {
  id: number;
  action: string;
  patientCompanyList: PatientCompany;
}

@Component({
    selector: 'app-form-dialog:not(e)',
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
        MatDatepickerModule,
        MatRadioModule,
        MatDialogClose,
        NgFor,
        MatOptionModule,
        MatSelectModule
    ],
})
export class FormDialogComponent implements OnInit{
  action: string;
  dialogTitle: string;
  dialogForm: UntypedFormGroup;
  patientCompany: PatientCompany;
  rateType$:any;
  category$:any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public patientCompanyService: PatientCompanyService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public dropdownService : DropdownService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = "Edit Patient Company";
      console.log("data edie", data);
      this.patientCompany = data.patientCompanyList;
    } else {
      this.dialogTitle = 'New Patient Company';
      const blankObject = {} as PatientCompany;
      this.patientCompany = new PatientCompany();
    }
    this.dialogForm = this.createContactForm();
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
      id: [this.patientCompany.id],
      name: [this.patientCompany.name],
      categoryId: [this.patientCompany.categoryId],
      rateTypeId: [this.patientCompany.rateTypeId],
      status: [this.patientCompany.status],
      hospitalId:[this.patientCompany.hospitalId]
    });
  }
  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public confirmAdd():void {
    console.log(this.action)
    if(this.action === 'edit'){
      this.patientCompanyService.updatePatientCompany(
        this.dialogForm.getRawValue())
    }else{
      this.patientCompanyService.addPatientCompany(
        this.dialogForm.getRawValue())
    }
    ;
  }

  ngOnInit() {
    this.rateTypeCombo();
    this.categoryCombo();
   }

   rateTypeCombo() {
     let data = new RateTye();
    data.status='Active';
     this.dropdownService.rateTypeCombo(data).subscribe((result: any) => {
       this.rateType$ = result.data;
       console.log("Rate Type combo ", this.rateType$)
     });
   } 
   categoryCombo() {
    let data = new PatientsCategory();
    data.status='Active';
    this.dropdownService.categoryCombo(data).subscribe((result: any) => {
      this.category$ = result.data;
      console.log("Patient Category combo ", this.category$)
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
