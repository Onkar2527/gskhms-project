import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Designation } from 'app/admin/model/designation.model';
import { SubDepartmentListService } from '../../subdepartmentsListService';
import { SubDepartmet } from 'app/admin/model/subdepartments.model';
import { CommonModule, NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { DropdownService } from 'app/admin/service/dropdown.service';

export interface DialogData {
  id: number;
  action: string;
  subdepartmentList: SubDepartmet;
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
  subdepartmentList: SubDepartmet;
  departments$: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public subdepartmentService: SubDepartmentListService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public dropdownService: DropdownService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = "Edit Sub-Department";
      this.subdepartmentList = data.subdepartmentList;
      console.log("data edit", this.subdepartmentList);
    } else {
      this.dialogTitle = 'Add Sub-Department';
      const blankObject = {} as SubDepartmet;
      this.subdepartmentList = new SubDepartmet();
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
      subDeptId: [this.subdepartmentList.subDeptId],
      subDeptName: [this.subdepartmentList.subDeptName],
      deptId:[this.subdepartmentList.deptId],
      deptName:[this.subdepartmentList.deptName],
      status: [this.subdepartmentList.status],
      hospitalId:[this.subdepartmentList.hospitalId]
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
      this.subdepartmentService.updateSubDepartment(
        this.listForm.getRawValue())
    }else{
      this.subdepartmentService.addSubdepartment(
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
    }

    getDepartments() {
      let data : any;
      this.dropdownService.departmentCombo(data).subscribe((result: any) => {
        this.departments$ = result.data;
        console.log("department combo ", this.departments$)
      });
    } 
}
