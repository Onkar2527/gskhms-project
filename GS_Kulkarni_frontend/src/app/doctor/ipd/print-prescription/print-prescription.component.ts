import { CommonModule, NgFor } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { PrescriptionService } from 'app/admin/service/prescription.service';
import { LoginService } from 'app/authentication/login.service';
import * as moment from 'moment';
import { NgxPrintModule } from 'ngx-print';
import { MasterService } from 'app/admin/service/master.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { catchError } from 'rxjs';
import { EmailService } from 'app/admin/service/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';

export interface DialogData {
  id: number;
  appoinment: any;
  withLH: boolean;
  prescriptionDate: Date
}

@Component({
  selector: 'app-print-prescription',
  standalone: true,
  imports: [BreadcrumbComponent, MatButtonModule, FeatherIconsComponent, MatIconModule, NgxPrintModule, NgFor, CommonModule],
  templateUrl: './print-prescription.component.html',
  styleUrl: './print-prescription.component.scss'
})
export class PrintPrescriptionComponent implements OnInit {
  @Input() appointmentInput!: any;
  @Input() casualtyData!: any;
  @Input() prescription!: any;
  @Input() showPrint: boolean = true;
  @Input() appointmentLabServices!: any;
  @Input() appointmentXrayServices!: any;

  presdcriptionData$!: any;
  id: any;
  appoinmentData: any;
  hospitalId: any;
  withLH!: boolean;

  constructor(public dialogRef: MatDialogRef<PrintPrescriptionComponent>,
    private prescriptionService: PrescriptionService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loginService: LoginService,
    public appointmentService: AppointmentsService,
    private masterService: MasterService,
    public emailService: EmailService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginService.currentLoggedInUser.subscribe((user: any) => {
      if (user != undefined) {
        this.hospitalId = user.hospitalId;
      }
    })
    this.id = this.data.appoinment ? this.data.id : this.appointmentInput?.id;
    this.withLH = this.data?.withLH;
    this.appoinmentData = this.showPrint ? this.data.appoinment : this.appointmentInput;
    if (!this.showPrint) {
      this.presdcriptionData$ = this.prescription;
    } else {
      this.loadPrescription();
      this.loadCasualty();
    }
    this.loadAppoinmentLabServiceDetails();
    this.loadAppoinmentXrayServiceDetails();
  }

  loadCasualty() {
    let data = {
      "appointmentId": this.id,
      "hospitalId": this.hospitalId
    }
    this.appointmentService.getCaualty(data).subscribe((res: any) => {
      this.casualtyData = res.data[0];
    })
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

  calculateAge(dob: Date) {
    return moment().diff(dob, 'years')
  }

  loadAppoinmentLabServiceDetails() {
    let data = {
      "appointmentId": this.id,
      "type": "T"
    }
    this.appointmentLabServices = [];
    this.masterService.getAppoinmentServiceDetails(data).subscribe((res: any) => {
      this.appointmentLabServices = res.data;
    });
  }

  loadAppoinmentXrayServiceDetails() {
    let data = {
      "appointmentId": this.id,
      "type": "X"
    }
    this.appointmentXrayServices = [];
    this.masterService.getAppoinmentServiceDetails(data).subscribe((res: any) => {
      this.appointmentXrayServices = res.data;
    });
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
