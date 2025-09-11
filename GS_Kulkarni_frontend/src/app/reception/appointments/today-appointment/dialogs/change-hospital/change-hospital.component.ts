import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-change-hospital',
  standalone: true,
  imports: [ MatDialogTitle,
          MatDialogContent,
          MatDialogActions,
          MatButtonModule,
          MatDialogClose,],
  templateUrl: './change-hospital.component.html',
  styleUrl: './change-hospital.component.scss'
})
export class ChangeHospitalComponent {
  constructor(private dialogRef: MatDialogRef<ChangeHospitalComponent>){}



  onYesClick(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
