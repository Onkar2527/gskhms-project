import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { Cashbook } from '../../cashbook';
import { CashbookService } from '../../services/cashbook.service';
import { MAT_DATE_LOCALE, MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, catchError, map, merge } from 'rxjs';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { SharedModule } from '@shared/shared.module';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';


@Component({
  selector: 'app-cash-book',
  templateUrl: './cash-book.component.html',
  styleUrl: './cash-book.component.scss',
   providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
      standalone: true,
      imports: [
        MatMenuModule,
        BreadcrumbComponent,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSortModule,
        NgClass,
        MatCheckboxModule,
        FeatherIconsComponent,
        MatRippleModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        DatePipe,
        MatDatepickerModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        CommonModule,
        SharedModule,
        MatCard,
    MatDialogActions,
    MatCardActions,
    MatCardContent,
    NgxMatTimepickerModule
      ],
})

export class CashbookFormComponent implements OnInit {
  form!: FormGroup;
  transactionTypes = ['INCOME', 'EXPENSE'];
  paymentModes = ['CASH', 'CARD', 'ONLINE', 'CHEQUE', 'UPI'];

  constructor(
    private fb: FormBuilder,
    private cashbookService: CashbookService,
    private dialogRef: MatDialogRef<CashbookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cashbook | null
  ) {}

  ngOnInit(): void {
    const today = new Date();
    
    // Format current time to 12-hour format with AM/PM
    const hours = today.getHours().toString().padStart(2, '0');
  const minutes = today.getMinutes().toString().padStart(2, '0');
  const currentTime24hr = `${hours}:${minutes}`;

      this.form = this.fb.group({
      
       entry_date: [this.data?.entry_date ? (this.data.entry_date) : today, Validators.required],
      entry_time: [this.data?.entry_time ?? currentTime24hr, Validators.required],
      description: [this.data?.description ?? ''],
      transaction_type: [this.data?.transaction_type ?? 'INCOME', Validators.required],
      amount: [this.data?.amount ?? 0, [Validators.required, Validators.min(0)]],
      payment_mode: [this.data?.payment_mode ?? 'CASH', Validators.required],
      reference_no: [this.data?.reference_no ?? '']
    });
  }



  save() {
    if (this.form.invalid) return;

    const entry: Cashbook = {
      ...this.form.value,
      created_by: 1
    };

    if (this.data?.id) {
      this.cashbookService.updateEntry(this.data.id, entry).subscribe(() => this.dialogRef.close(true));
    } else {
      this.cashbookService.createEntry(entry).subscribe(() => this.dialogRef.close(true));
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
// export class CashBookComponent implements OnInit {
//   // form = this.fb.group({
//   //   entry_date: ['', Validators.required],
//   //   entry_time: ['', Validators.required],
//   //   description: ['', Validators.required],
//   //   transaction_type: ['INCOME', Validators.required],
//   //   amount: [0, Validators.required],
//   //   payment_mode: ['CASH', Validators.required],
//   //   reference_no: ['']
//   // });

//   form = this.fb.group({
//     entry_date: ['', Validators.required],
//     entry_time: ['', Validators.required],
//     description: [''],
//     transaction_type: ['', Validators.required],
//     amount: [0, Validators.required],
//     payment_mode: ['', Validators.required],
//     reference_no: ['']
//   });

//   constructor(
//     private fb: FormBuilder,
//     private dialogRef: MatDialogRef<CashBookComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: Cashbook | null,
//     private cashbookService: CashbookService
//   ) {
//     if (data) this.form.patchValue(data);
//   }

//   ngOnInit() {
    
//   }

//   // save() {
//   //   if (this.form.invalid) return;
//   //   const entry = { ...this.form.value, created_by: 1 }; // Hardcoded user (or fetch from auth)

//   //   if (this.data) {
//   //     // Update
//   //     this.cashbookService.updateEntry(this.data.id!, entry).subscribe(() => this.dialogRef.close(true));
//   //   } else {
//   //     // Create
//   //     this.cashbookService.createEntry(entry).subscribe(() => this.dialogRef.close(true));
//   //   }
//   // }

//   save() {
//     if (this.form.invalid) return;
  
//     const rawEntry = this.form.value;
//     const entry = {
//       entry_date: rawEntry.entry_date ?? '',  // fallback empty string
//       entry_time: rawEntry.entry_time ?? '',
//       description: rawEntry.description ?? '',
//       transaction_type: rawEntry.transaction_type as 'INCOME' | 'EXPENSE',
//       amount: rawEntry.amount ?? 0,
//       payment_mode: rawEntry.payment_mode ?? '',
//       reference_no: rawEntry.reference_no ?? '',
//       created_by: 1
//     };
  
//     if (this.data) {
//       this.cashbookService.updateEntry(this.data.id!, entry).subscribe(() => this.dialogRef.close(true));
//     } else {
//       this.cashbookService.createEntry(entry).subscribe(() => this.dialogRef.close(true));
//     }
//   }
  

  
  



// }






