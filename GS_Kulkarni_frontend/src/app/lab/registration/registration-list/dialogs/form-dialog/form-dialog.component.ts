import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Registration } from 'app/lab/model/registration.model';
import { RegistrationService } from 'app/lab/service/registration.service';

export interface DialogData {
  id: number;
  action: string;
  registration: Registration;
}

@Component({
  selector: 'app-form-dialog:not(c)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogClose,
  ],
})
export class FormDialogComponent {
  action: string;
  dialogTitle!: string;
  registrationForm: UntypedFormGroup;
  registration!: Registration;
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public registrationService: RegistrationService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'update') {
      
      this.dialogTitle = data.registration.firstName+' '+data.registration.lastName;
      this.registration = data.registration;
    
    }
    this.registrationForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
     
      sampleCollected: [
        formatDate(this.registration.sampleCollected?this.registration.sampleCollected:new Date(), 'yyyy-MM-dd', 'en'),
        [Validators.required],
      ],
      sampleCollectedTime: [new Date().toString().split(' ')[4],
        [Validators.required],
      ]
    });
  }
  submit() {
    let data={
      "id": this.registration.id,
      "sampleCollected": this.registrationForm.value.sampleCollected,
      "sampleCollectedTime": this.registrationForm.value.sampleCollectedTime,
      "status":"Sample Collected"
    }

    this.registrationService.updateStatusRegistration(data).subscribe((result: any) => {
      if (result['message'] == 'Data Modified Successfully') {
        this.dialogRef.close();
      } 
    });

  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  
}
