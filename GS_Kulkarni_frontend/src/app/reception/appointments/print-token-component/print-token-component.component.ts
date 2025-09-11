import { NgFor, CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { ServiceRate } from 'app/admin/model/servicerate.model';
import { ServiceRateService } from 'app/admin/service/servicerate.service';
import { LoginService } from 'app/authentication/login.service';
import { NgxPrintModule } from 'ngx-print';
import * as moment from 'moment';

export interface DialogData {
  appoinment: any;
}

@Component({
  selector: 'app-print-token-component',
  standalone: true,
  imports: [BreadcrumbComponent, MatButtonModule, FeatherIconsComponent, MatIconModule, NgxPrintModule, NgFor, CommonModule],
  templateUrl: './print-token-component.component.html',
  styleUrl: './print-token-component.component.scss'
})
export class PrintTokenComponentComponent implements OnInit {
  presdcriptionData$!: any;
  id: any;
  appoinmentData: any;
  serviceRate!: any;
  hospitalId: any;
  constructor(public dialogRef: MatDialogRef<PrintTokenComponentComponent>,
    public serviceRateService: ServiceRateService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.loginService.currentLoggedInUser.subscribe((user: any) => {
      if (user != undefined) {
        this.hospitalId = user.hospitalId;
      }
    })
    this.appoinmentData = this.data.appoinment;
    this.getAmount(this.appoinmentData.doctorId, this.appoinmentData.serviceId);
  }
 
  getAmount(doctorId: number, serviceId: number){
    let serviceRates!: ServiceRate[];
    this.serviceRateService.getServiceRateForDoctor(doctorId, serviceId, this.hospitalId).subscribe((result: any) => {
      serviceRates = result.data;
      this.serviceRate = serviceRates.find((obj) => obj.serviceId == serviceId);
    });
  }

  calculateAge(dob : Date){
    return moment().diff(dob, 'years')
  }
}
