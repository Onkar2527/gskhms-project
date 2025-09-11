/* eslint-disable @typescript-eslint/no-empty-function */
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Direction } from '@angular/cdk/bidi';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { Patient } from 'app/admin/patients/allpatients/patient.model';
import { MasterService } from 'app/admin/service/master.service';
import { MatDialog } from '@angular/material/dialog';

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
    });
    this.getBeds();
  }

  getBeds(){
    this.masterService.getInfra().subscribe((data:any)=>{
      this.floorData=data.data.floors;
    })
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
