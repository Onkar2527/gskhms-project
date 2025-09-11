import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';

export interface DialogData {
  id: number;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  appointment: any;
}

@Component({
    selector: 'app-delete:not(b)',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ],
})
export class DeleteDialogComponent {
  appointment!:any;
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private appointmentsService:AppointmentsService
  ) {
    this.appointment=this.data
   }
  onNoClick(): void {
    this.dialogRef.close();
  }
  confirmDelete(): void {
    this.appointment.status = 'Cancelled';
    this.appointmentsService.updateAppointments(this.appointment).subscribe((result: any) => {

    })
  }
}
