import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { DepartmentListService } from '../../department-list.service';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentList } from '../../department-list.model';
import { formatDate } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Section } from 'app/admin/model/section.model';
import { DropdownService } from 'app/admin/service/dropdown.service';

export interface DialogData {
  id: number;
  action: string;
  departmentList: DepartmentList;
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
export class FormDialogComponent implements OnInit {
  action: string;
  dialogTitle: string;
  departmentListForm: UntypedFormGroup;
  departmentList: DepartmentList;
  sectionCombo$: any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public departmentListService: DepartmentListService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public dropdownService: DropdownService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = "Edit Department";
      this.departmentList = data.departmentList;
    } else {
      this.dialogTitle = 'New Department';
      const blankObject = {} as DepartmentList;
      this.departmentList = new DepartmentList();
    }
    this.departmentListForm = this.createContactForm();
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
      d_date:[this.departmentList.d_date],
      id: [this.departmentList.deptId],
      deptId: [this.departmentList.deptId],
      deptName: [this.departmentList.deptName],
    //  description: [this.departmentList.description],
      // d_date: [
      //   formatDate(this.departmentList.d_date, 'yyyy-MM-dd', 'en'),
      //   [Validators.required],
      // ],
   //   d_head: [this.departmentList.d_head],
      status: [this.departmentList.status],
      sectionId:[this.departmentList.sectionId],
      hospitalId:[this.departmentList.hospitalId]
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
    this.departmentListService.updateDepartmentList(
      this.departmentListForm.getRawValue())
    }else{
      this.departmentListService.addDepartmentList(
        this.departmentListForm.getRawValue())
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
    this.sectionCombo();
   }

   sectionCombo() {
     let data = new Section();
     data.status = 'Active';
     this.dropdownService.sectionCombo(data).subscribe((result: any) => {
       this.sectionCombo$ = result.data;
      //  console.log("Section combo ", this.sectionCombo$)
     });
   } 

}

