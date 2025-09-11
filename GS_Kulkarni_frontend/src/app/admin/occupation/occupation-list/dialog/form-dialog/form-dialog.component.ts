import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
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
import { Occupation } from 'app/admin/model/occupation.model';
import { OccupationListService } from '../../occupationListService';

export interface DialogData {
  id: number;
  action: string;
  occupationList: Occupation;
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
    ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  occupationListForm: UntypedFormGroup;
  occupationList: Occupation;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public occupationListService: OccupationListService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = "Edit Occupation";
      console.log("data edie", data);
      this.occupationList = data.occupationList;
    } else {
      this.dialogTitle = 'New Occupation';
      const blankObject = {} as Occupation;
      this.occupationList = new Occupation();
    }
    this.occupationListForm = this.createContactForm();
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
      id: [this.occupationList.id],
      name: [this.occupationList.name],
      status: [this.occupationList.status],
      hospitalId:[this.occupationList.hospitalId]
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
      this.occupationListService.updateOccupation(
        this.occupationListForm.getRawValue())
    }else{
      this.occupationListService.addOccupation(
        this.occupationListForm.getRawValue())
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
}
