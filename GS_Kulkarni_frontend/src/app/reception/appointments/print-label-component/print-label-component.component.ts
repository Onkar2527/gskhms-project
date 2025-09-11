import { NgFor, CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { ServiceRateService } from 'app/admin/service/servicerate.service';
import { LoginService } from 'app/authentication/login.service';
import { NgxPrintModule } from 'ngx-print';
import { PrintTokenComponentComponent } from '../print-token-component/print-token-component.component';
import * as moment from 'moment';

export interface DialogData {
  appoinment: any;
}

@Component({
  selector: 'app-print-label-component',
  standalone: true,
  imports: [BreadcrumbComponent, MatButtonModule, FeatherIconsComponent, MatIconModule, NgxPrintModule, NgFor, CommonModule],
  templateUrl: './print-label-component.component.html',
  styleUrl: './print-label-component.component.scss'
})
export class PrintLabelComponentComponent implements OnInit {
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
  }
 
  calculateAge(dob : Date){
    return moment().diff(dob, 'years')
  }
}

