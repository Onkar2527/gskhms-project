import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { Registration } from 'app/lab/model/registration.model';
import { RegistrationService } from 'app/lab/service/registration.service';
import { SharedModule } from '@shared/shared.module';

export interface DialogData {
  id: number;
  action: string;
  registration: Registration;
}

@Component({
  selector: 'approve-lab-report',
  templateUrl: './approve-lab-report.component.html',
  styleUrls: ['./approve-lab-report.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class ApproveLabReportComponent {
  action: string;
  dialogTitle!: string;
  registrationForm: UntypedFormGroup;
  registration!: Registration;
  constructor(
    public dialogRef: MatDialogRef<ApproveLabReportComponent>,
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
     
      approvalStatus: [
        'P',
        [Validators.required],
      ],
      approvalNote: ['',
        [Validators.required],
      ],
      approvalDatetime: [
        new Date(),
        [Validators.required],
      ],
    });
  }
  submit() {
    if(this.registrationForm.invalid)
      return;

    let data={
      "id": this.registration.id,
      "approvalStatus": this.registrationForm.value.approvalStatus,
      "approvalNote": this.registrationForm.value.approvalNote,
      "approvalDatetime":this.registrationForm.value.approvalDatetime

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
