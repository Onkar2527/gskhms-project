import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { Registration } from 'app/lab/model/registration.model';
import { RegistrationService } from 'app/lab/service/registration.service';
import { SharedModule } from '@shared/shared.module';

export interface DialogData {
  id: number;
  action: string;
  registration: Registration;
}

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  standalone: true,
  imports: [
    SharedModule
  ],
})
export class GenerateReportComponent implements OnInit {
  action: string;
  dialogTitle!: string;
  registration!: Registration;
  id: any;
  constructor(
    public dialogRef: MatDialogRef<GenerateReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public registrationService: RegistrationService,
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.dialogTitle = data.registration.firstName + ' ' + data.registration.lastName;
    this.registration = data.registration;
  }

  ngOnInit(): void {
    this.id = this.registration.id;
    this.loadReportData();
  }

  submit() {
    let data = {
      "id": this.id,
      "status": "Report Generated",
      "reportGenerated": formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      "labTestHeaderList": this.reportData$.labTestHeaderList
    }
    this.registrationService.updateRegistration(data).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.dialogRef.close();
      }
    });
  }

  reportData$!: any;
  onNoClick(): void {
    this.dialogRef.close();
  }


  loadReportData() {
    let data = {
      "registrationId": this.id
    }
    this.registrationService.getLabReport(data).subscribe((res: any) => {
      this.reportData$ = res.data[0];
    })
  }

}
