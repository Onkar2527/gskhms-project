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
import { Bank } from '../../../../model/bank.model';
import { BankService } from '../../../../service/bank.service';
import { CommonModule, NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../../../core';
import { Employee } from '../../../../employees/allemployees/employees.model';
import { DropdownService } from '../../../../service/dropdown.service';

export interface DialogData {
  id: number;
  action: string;
  bankList: Bank;
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
  bank: Bank;
  userCombo$:any;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public bankService: BankService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public dropdownService :DropdownService
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = "Edit Bank";
      console.log("data edie", data);
      this.bank = data.bankList;
    } else {
      this.dialogTitle = 'New Bank';
      const blankObject = {} as Bank;
      this.bank = new Bank();
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
      bankId: [this.bank.bankId],
      userId: [this.bank.userId],
      accountHolderName: [this.bank.accountHolderName],
      accountNumber: [this.bank.accountNumber],
      ifscCode: [this.bank.ifscCode],
      branchName: [this.bank.branchName],
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
      this.bankService.updateBank(
        this.dialogForm.getRawValue())
    }else{
      this.bankService.addBank(
        this.dialogForm.getRawValue())
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
   }

   userCombo() {
     let data = new Employee();
     data.status = 'Active';
     this.dropdownService.userCombo(data).subscribe((result: any) => {
       this.userCombo$ = result.data;
       console.log("user combo ", this.userCombo$)
     });
   }
}
