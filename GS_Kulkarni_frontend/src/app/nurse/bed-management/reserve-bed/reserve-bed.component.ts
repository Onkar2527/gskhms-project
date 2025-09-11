import { NgClass } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '@shared/shared.module';
import { Bed } from 'app/admin/model/bed.model';
import { MasterService } from 'app/admin/service/master.service';

export interface DialogData {
  bed: any;
}

@Component({
  selector: 'app-reserve-bed',
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
  templateUrl: './reserve-bed.component.html',
  styleUrl: './reserve-bed.component.scss'
})
export class ReserveBedComponent {
  bed!: Bed;
  constructor(
    public dialogRef: MatDialogRef<ReserveBedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public masterService: MasterService
  ) { }

  ngOnInit(): void {
    this.bed = this.data.bed;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  confirmReservation(): void {
    this.bed.status = 'R';
    this.masterService.updateBed(this.bed).subscribe((result: any) => {
      this.dialogRef.close();
    });
  }
}
