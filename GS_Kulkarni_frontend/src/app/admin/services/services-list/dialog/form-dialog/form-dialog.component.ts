import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { Services } from 'app/admin/model/services.model';
import { ServicesService } from 'app/admin/service/services.service';
import { DepartmentList } from 'app/admin/departments/department-list/department-list.model';
import { ServiceGroup } from 'app/admin/model/servicegroup.model';
import { SubDepartmet } from 'app/admin/model/subdepartments.model';
import { NgFor } from '@angular/common';

export interface DialogData {
  id: number;
  action: string;
  servicesList: Services;
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
  listForm: UntypedFormGroup;
  servicesList: Services;
  departments$: any;
  serviceGroupCombo$: any;
  subDepartmentCombo$: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public servicesService: ServicesService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public dropdownService: DropdownService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = "Edit Services";
      this.servicesList = data.servicesList;
      console.log("data edit", this.servicesList);
    } else {
      this.dialogTitle = 'Add Services';
      this.servicesList = new Services();
    }
    this.listForm = this.createContactForm();
    console.log("listForm  ", this.listForm)
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
      id: [this.servicesList.id],
      name: [this.servicesList.name],
      serviceGroupId:[this.servicesList.serviceGroupId],
      deptId:[this.servicesList.deptId],
      subDeptId:[this.servicesList.subDeptId],
      rate:[this.servicesList.rate],
      status: [this.servicesList.status],
      hospitalId:[this.servicesList.hospitalId],
      rateChangeApplicable:[this.servicesList.rateChangeApplicable]
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
      this.servicesService.updateServices(
        this.listForm.getRawValue())
    }else{
      this.servicesService.addServices(
        this.listForm.getRawValue())
    }
    ;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
  ngOnInit() {
     this.getDepartments();
     this.serviceGroupCombo();
     this.subDepartmentCombo();
    }

    getDepartments() {
      const data = new DepartmentList();
      data.status = 'Active';
      this.dropdownService.departmentCombo(data).subscribe((result: any) => {
        this.departments$ = result.data;
        console.log("department combo ", this.departments$)
      });
    } 

    serviceGroupCombo(){
      let data = new ServiceGroup();
      this.dropdownService.serviceGroupCombo(data).subscribe((result: any) => {
        this.serviceGroupCombo$ = result.data;
        console.log("service group combo ", this.serviceGroupCombo$)
      });
    }
    
    subDepartmentCombo(){
      let data = new SubDepartmet();
      data.status="Active";
      this.dropdownService.subDepartmentCombo(data).subscribe((result: any) => {
        this.subDepartmentCombo$ = result.data;
        console.log("subDepartment combo ", this.subDepartmentCombo$)
      });
    }

}
