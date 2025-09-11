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
import { Designation } from '../../../../model/designation.model';
import { CommonModule, NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { DropdownService } from '../../../../service/dropdown.service';
import { DepartmentList } from '../../../../departments/department-list/department-list.model';
import { ServiceGroup } from '../../../../model/servicegroup.model';
import { SubDepartmet } from '../../../../model/subdepartments.model';
import { UserDepartments } from '../../../../model/userdepartment.model';
import { UserDepartmentService } from '../../../../service/userdepartment.service';
import { Employee } from '../../../../employees/allemployees/employees.model';

export interface DialogData {
  id: number;
  action: string;
  userDeptList: UserDepartments;
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
  userDeptList: UserDepartments;
  departments$: any;
  subDepartmentCombo$: any;
  userCombo$: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public userDeptService: UserDepartmentService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public dropdownService: DropdownService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = "Edit User Departments";
      this.userDeptList = data.userDeptList;
      console.log("data edit", this.userDeptList);
    } else {
      this.dialogTitle = 'Assign User Departments';
      const blankObject = {} as UserDepartments;
      this.userDeptList = new UserDepartments();
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
      id: [this.userDeptList.id],
      userId:[this.userDeptList.userId],
      Username: [this.userDeptList.userName],
      deptId:[this.userDeptList.deptId],
      subDeptId:[this.userDeptList.subDeptId],
      startTimestamp:[this.userDeptList.startTimestamp],
      endTimestamp:[this.userDeptList.endTimestamp],
      status: [this.userDeptList.status],
      hospitalId:[this.userDeptList.hospitalId]
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
      this.userDeptService.updateUserDept(this.listForm.getRawValue())
    }else{
      this.userDeptService.addUserDept(this.listForm.getRawValue())
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
     this.subDepartmentCombo(this.userDeptList.deptId);
     this.userCombo();
    }

    getDepartments() {
      const data = new DepartmentList();
      data.status = 'Active';
      this.dropdownService.departmentCombo(data).subscribe((result: any) => {
        this.departments$ = result.data;
        console.log("department combo ", this.departments$)
      });
    } 

    userCombo() {
      const data = new Employee();
      data.status = 'Active';
      this.dropdownService.userCombo(data).subscribe((result: any) => {
        this.userCombo$ = result.data;
        console.log("user combo ", this.userCombo$)
      });
    } 

    subDepartmentCombo(value:any){
      let data = new SubDepartmet();
      data.status="Active";
      //data.deptId =  this.listForm.get('deptId')?.value;
      data.deptId = value.value;
      this.dropdownService.subDepartmentCombo(data).subscribe((result: any) => {
      this.subDepartmentCombo$ = result.data;
      if(this.subDepartmentCombo$.length === 0)  {
       this.listForm.controls['subDeptId'].setValue(0);
      }
        console.log("subDepartment combo ", this.subDepartmentCombo$)
      });
    }
}
