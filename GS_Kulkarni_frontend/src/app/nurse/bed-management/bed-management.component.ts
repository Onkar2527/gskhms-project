/* eslint-disable @typescript-eslint/no-empty-function */
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Direction } from '@angular/cdk/bidi';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { Patient } from 'app/admin/patients/allpatients/patient.model';
import { MasterService } from 'app/admin/service/master.service';
import { ReserveBedComponent } from './reserve-bed/reserve-bed.component';
import { MatDialog } from '@angular/material/dialog';
import { AttentIPDAppoinmentComponent } from 'app/doctor/ipd/attent-ipd-appoinment/attent-appoinment.component';
import { DischargeBedComponent } from './discharge-bed/discharge-bed.component';

@Component({
  selector: 'app-bed-management',
  templateUrl: './bed-management.component.html',
  styleUrls: ['./bed-management.component.scss'],
  standalone: true,
  imports: [
   SharedModule,
   CdkAccordionModule
  ]
})

export class BedManagementComponent implements OnInit {
  floorData:any;
  patient!: Patient;
  assessment!: any; 
  emergencyAssessment!: any;
  patientId!: number;

  constructor(
    private masterService:MasterService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['assessment']){
        this.assessment = JSON.parse(params['assessment']);
        this.patient = this.assessment.patientDetails;
        this.patientId = this.patient.patientId;
      }
      if(params['emergencyAssessment']){
        this.emergencyAssessment = JSON.parse(params['emergencyAssessment']);
        this.patient = this.emergencyAssessment.patientDetails;
        this.patientId = this.patient.patientId;
      }
    });
    this.getBeds();
  }

  getBeds(){
    this.masterService.getInfra(false).subscribe((data:any)=>{
      this.floorData=data.data.floors;
    })
  }

  allocate(bed: any){
    this.router.navigate(['/nurse/appointments/book'], { queryParams: {  patient: JSON.stringify(this.patient), assessment: JSON.stringify(this.assessment), emergencyAssessment: JSON.stringify(this.emergencyAssessment), bed: JSON.stringify(bed) } });
  }

  update(bed: any){
    this.router.navigate(['/nurse/appointments/book'], { queryParams: {  patient: JSON.stringify(this.patient), assessment: JSON.stringify(this.assessment), emergencyAssessment: JSON.stringify(this.emergencyAssessment), bed: JSON.stringify(bed) } });
  }

  reserve(bed: any){
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    let dialogRef = this.dialog.open(ReserveBedComponent, {
      data: {
        bed: bed
      },
      direction: tempDirection,
      height: '50%',
      width: '60%'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getBeds();
    });
  }

  public addDetails(bed: any) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialog?.open(AttentIPDAppoinmentComponent, {
      id: 'Attend',
      data: {
        id: bed.id,
        bed: bed,
        action: 'details',
      },
      direction: tempDirection,
      height: "100%",
      width: "100%",
      maxWidth: "100%",
      maxHeight: "100%",
    });
  }
  
  discharge(bed: any): void {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    let dialogRef = this.dialog.open(DischargeBedComponent, {
      data: {
        bed: bed
      },
      direction: tempDirection,
      height: '50%',
      width: '60%'
    });
    dialogRef.afterClosed().subscribe(result => {
      setTimeout(()=>{                           
        this.getBeds();
      }, 1000);
    });
  }

  selectColor(bed: any){
    if(bed.status == 'A'){
      return 'greenColor';
    } else if(bed.status == 'B'){
      return 'redColor';
    } else if(bed.status == 'R'){
      return 'yellowColor';
    }
  }
}
