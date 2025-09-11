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
import { Employee } from '../../../../employees/allemployees/employees.model';
import { UserRole } from '../../../../model/userrole.model';
import { UserRoleService } from '../../../../service/userrole.service';
import { Role } from '../../../../model/role.model';

export interface DialogData {
  id: number;
  action: string;
  userRoleList: UserRole;
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
  userRoleList: UserRole;
  roleCombo$: any;
  userCombo$: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public userRoleService: UserRoleService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public dropdownService: DropdownService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = "Edit User Role";
      this.userRoleList = data.userRoleList;
      console.log("data edit", this.userRoleList);
    } else {
      this.dialogTitle = 'Assign User Role';
      const blankObject = {} as UserRole;
      this.userRoleList = new UserRole();
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
      id: [this.userRoleList.id],
      userId:[this.userRoleList.userId],
      Username: [this.userRoleList.userName],
      roleId:[this.userRoleList.roleId],
      roleName:[this.userRoleList.roleName],
      startTimestamp:[this.userRoleList.startTimestamp],
      endTimestamp:[this.userRoleList.endTimestamp],
      status: [this.userRoleList.status],
      hospitalId:[this.userRoleList.hospitalId]
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
      this.userRoleService.updateUserRole(this.listForm.getRawValue())
    }else{
      this.userRoleService.addUserRole(this.listForm.getRawValue())
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
     this.userCombo();
     this.roleCombo();
    }

    roleCombo() {
      const data = new Role();
      data.status = 'Active';
      this.dropdownService.roleCombo(data).subscribe((result: any) => {
        this.roleCombo$ = result.data;
        console.log("Role combo ", this.roleCombo$)
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
}
