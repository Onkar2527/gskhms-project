import { CommonModule, NgFor } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { LoginService } from 'app/authentication/login.service';
import * as moment from 'moment';
import { NgxPrintModule } from 'ngx-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { catchError } from 'rxjs';
import { EmailService } from 'app/admin/service/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { PrescriptionService } from 'app/admin/service/prescription.service';
import { AfterPrescriptionService } from 'app/admin/service/afterprescription.service';

export interface DialogData {
  prescriptionDate: any;
  afterPrescriptionData: any;
  id: number;
  appoinment: any;
  dischargeSummaryData: any
}

@Component({
  selector: 'print-discharge-summary',
  standalone: true,
  imports: [BreadcrumbComponent, MatButtonModule, FeatherIconsComponent, MatIconModule, NgxPrintModule, NgFor, CommonModule],
  templateUrl: './print-discharge-summary.component.html',
  styleUrl: './print-discharge-summary.component.scss'
})
export class PrintDischargeSummary implements OnInit {

   presdcriptionData$!: any;
   afterPrescriptionData$!: any;
  dischargeSummaryData!: any;
  id: any;
  appoinmentData: any;
  hospitalId: any;
  @Input() prescription!: any;
  @Input() afterPrescription!: any;

  constructor(public dialogRef: MatDialogRef<PrintDischargeSummary>,
    
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
    private prescriptionService: PrescriptionService,
    private afterPrescriptionService: AfterPrescriptionService,
    private loginService: LoginService,
    public appointmentService: AppointmentsService,
    public emailService: EmailService,
    private _snackBar: MatSnackBar) { }
     

  ngOnInit(): void {
    this.loginService.currentLoggedInUser.subscribe((user: any) => {
      if (user != undefined) {
        this.hospitalId = user.hospitalId;
      }
    })
    this.id = this.data.id;
    this.appoinmentData = this.data.appoinment;
    this.dischargeSummaryData = this.data.dischargeSummaryData
    this.presdcriptionData$ = this.prescription;
    this.afterPrescriptionData$ = this.afterPrescription;
    this.loadPrescription();
    this.AfterloadPrescription();
     console.log("presdcriptionData$ ", this.afterPrescriptionData$);
    console.log("allll icncmb scsn csncshc cnhvcscn csvnh ",this.dischargeSummaryData);
  }

  loadPrescription() {
    let data = {
      "appointmentId": this.id,
      "hospitalId": this.hospitalId,
      "prescriptionDate": this.data.prescriptionDate
    }
    this.prescriptionService.getPrescription(data).subscribe((res: any) => {
      this.presdcriptionData$ = res.data;
    })
   
  }

  AfterloadPrescription() {
    let data = {
      "appointmentId": this.id,
      "hospitalId": this.hospitalId,
      "prescriptionDate": this.data.prescriptionDate
    }
    this.afterPrescriptionService.getAfterPrescription(data).subscribe((res: any) => {
      this.afterPrescriptionData$ = res.data;
    })
   
  }



  calculateAge(dob: Date) {
    return moment().diff(dob, 'years')
  }

  sharePDFOnEmail() {
    const htmlWidth = document.getElementById('print-section')?.offsetWidth ?? 0;
    const htmlHeight = document.getElementById('print-section')?.offsetHeight ?? 0;

    let pdfWidth = htmlWidth;
    let pdfHeight = htmlHeight;

    const canvasImageWidth = htmlWidth;
    const canvasImageHeight = htmlHeight;

    const data = document.getElementById('print-section');
    let pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
    html2canvas(data!, { allowTaint: true }).then(canvas => {
      canvas.getContext('2d');
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, 'png', 0, 0, canvasImageWidth, canvasImageHeight);
      const formData = new FormData();
      formData.append('file', pdf.output('blob'), this.appoinmentData?.firstName + '_' + this.appoinmentData?.lastName + '.pdf');
      formData.append('subject', this.appoinmentData?.firstName + ' ' + this.appoinmentData?.lastName);
      formData.append('message', 'PFA Presciption for Subjected Person.');

      this.emailService.sendEmail(formData).pipe(
        catchError(() => {
          this.openSnackBar('Error occurred to send Email');
          return '';
        })
      ).subscribe((result: any) => {
        this.openSnackBar('Email sent successfully.');
      })
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
