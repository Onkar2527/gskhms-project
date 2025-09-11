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
import { PrintPaymentReceiptComponent } from '../print-payment-receipt/print-payment-receipt.component';

export interface DialogData {
  bill: any;
}

@Component({
  selector: 'app-print-bill',
  standalone: true,
  imports: [BreadcrumbComponent, MatButtonModule, FeatherIconsComponent, MatIconModule, NgxPrintModule, NgFor, CommonModule],
  templateUrl: './print-bill.component.html',
  styleUrl: './print-bill.component.scss'
})
export class PrintBillComponent implements OnInit {
  presdcriptionData$!: any;
  id: any;
  billData: any;
  hospitalId: any;
  constructor(public dialogRef: MatDialogRef<PrintPaymentReceiptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.loginService.currentLoggedInUser.subscribe((user: any) => {
      if (user != undefined) {
        this.hospitalId = user.hospitalId;
      }
    })
    this.billData = this.data.bill;
  }
 
}