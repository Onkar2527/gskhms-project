import { NgFor, CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { LoginService } from 'app/authentication/login.service';
import { NgxPrintModule } from 'ngx-print';

export interface DialogData {
  payment: any;
}

@Component({
  selector: 'pp-print-payment-receipt',
  standalone: true,
  imports: [BreadcrumbComponent, MatButtonModule, FeatherIconsComponent, MatIconModule, NgxPrintModule, NgFor, CommonModule],
  templateUrl: './print-payment-receipt.component.html',
  styleUrl: './print-payment-receipt.component.scss'
})
export class PrintPaymentReceiptComponent implements OnInit {
  presdcriptionData$!: any;
  id: any;
  paymentData: any;
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
    this.paymentData = this.data.payment;
  }
 
}
