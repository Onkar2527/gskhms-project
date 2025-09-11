import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '@shared/shared.module';
import { Bed } from 'app/admin/model/bed.model';
import { MasterService } from 'app/admin/service/master.service';
import { LoginService } from 'app/authentication/login.service';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { catchError } from 'rxjs';

export interface DialogData {
  bed: any;
}

@Component({
  selector: 'app-discharge-bed',
  standalone: true,
  imports: [       
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    MatFormFieldModule,
    NgClass,
    SharedModule
  ],
  templateUrl: './discharge-bed.component.html',
  styleUrl: './discharge-bed.component.scss'
})
export class DischargeBedComponent {
  dischargeNote!: string;
  appointment!: Appointments;
  bed!: Bed;
  hospitalId: number = 0;
  dischargeSummaryData!: any;
  billData!: any;

  constructor(
    public dialogRef: MatDialogRef<DischargeBedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public appointmentService: AppointmentsService,
    public masterService: MasterService,
    public loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.loginService.currentLoggedInUser.subscribe((user: any) => {
      if (user != undefined) {
        this.hospitalId = user.hospitalId;
      }
    })
    this.bed = this.data.bed;
    this.masterService.getAppointmentByBed({ bedId: this.bed?.id, status: 'A' }).subscribe((data: any) => {
      let assignedData = data.data;
      this.appointmentService.getAllAppoinment({ id: assignedData[0].appointmentId }).subscribe((data: any) => {
        this.appointment = data.data[0];
        this.loadDischargeSummary();
        this.loadBill();
      });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  confirmDischarge(): void {
    this.appointment.dischargeTime = new Date();
    this.appointment.dischargeStatus = true;
    this.appointment.dischargeNote = this.dischargeNote;
    this.appointmentService.updateAppoinment(this.appointment).subscribe((result: any) => {
      this.masterService.releaseBed(this.bed).subscribe((result: any) => {
        this.dialogRef.close();
      });
    });
  }

  loadDischargeSummary() {
    let data = {
      "appointmentId": this.appointment?.id,
      "hospitalId": this.hospitalId
    }
    this.appointmentService?.getDischargeSummary(data).pipe(
      catchError(() => {
        return '';
      })
    ).subscribe((res: any) => {
      this.dischargeSummaryData = res.data[0] ?? null;
    });
  }

  loadBill() {
    let data = {
      "appointmentId": this.appointment?.id,
      "hospitalId": this.hospitalId
    }
    this.appointmentService?.getBill(data).pipe(
      catchError(() => {
        return '';
      })
    ).subscribe((res: any) => {
      this.billData = res.data[0] ?? null;
    });
  }
}
