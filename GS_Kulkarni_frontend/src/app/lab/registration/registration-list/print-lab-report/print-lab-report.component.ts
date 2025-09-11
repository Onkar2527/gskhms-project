import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import { LoginService } from 'app/authentication/login.service';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { RegistrationService } from 'app/lab/service/registration.service';
import * as moment from 'moment';
import { catchError } from 'rxjs';

// @ts-ignore
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EmailService } from 'app/admin/service/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  id: number;
  appoinment: any;
  withLH: boolean;
}

@Component({
  selector: 'app-print-lab-report',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './print-lab-report.component.html',
  styleUrl: './print-lab-report.component.scss'
})
export class PrintLabReportComponent implements OnInit{
  reportData$!:any;
  id:any;
  appoinmentData:any;
  hospitalId:any;
  withLH!: boolean;

  constructor(public dialogRef: MatDialogRef<PrintLabReportComponent>,
  private registrationService:RegistrationService,
  @Inject(MAT_DIALOG_DATA) public data: DialogData,
  private loginService:LoginService,
  private appoinmentService:AppointmentsService,
  public emailService: EmailService,
  private _snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.loginService.currentLoggedInUser.subscribe((user: any) => {
      if (user != undefined) {
        this.hospitalId = user.hospitalId;
      }
    })
    this.id = this.data.id;
    this.withLH = this.data.withLH;
    this.loadReportData();
  }

  loadReportData() {
    let data = {
      "registrationId": this.id
    }
    this.registrationService.getLabReport(data).subscribe((res: any) => {
      this.reportData$ = res.data[0];
      this.getAppoinment(res.data[0].appointmentId)
    })
  }

  getAppoinment(appoinment_id: any) {
    let data = {
      id: appoinment_id
    }
    this.appoinmentService.getAllAppoinment(data).subscribe((data: any) => {
      this.appoinmentData = data['data'][0]
    })
  }

  calculateAge(dob: Date) {
    return moment().diff(dob, 'years')
  }

  highlightIfOutOfRange(formula: any, value: any) {
    let stringArray = formula.split(' ');
    for (let index = 0; index < stringArray.length; index++) {
      if (stringArray[index] == '<') {
        return !(value < stringArray[index + 1]);
      } else if (stringArray[index] == '<=') {
        return !(value <= stringArray[index + 1]);
      } else if (stringArray[index] == '>') {
        return !(value > stringArray[index + 1]);
      } else if (stringArray[index] == '>=') {
        return !(value >= stringArray[index + 1]);
      }
    }
    return false;
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
      formData.append('message', 'PFA Lab Report for Subjected Person.');

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
