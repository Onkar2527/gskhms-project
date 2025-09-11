// import { Component } from '@angular/core';
// import { Cashbook } from '../cashbook';
// import { CashbookService } from '../services/cashbook.service';
// import { CashbookFormComponent } from '../cash-book/cash-book/cash-book.component';
// import { MatDialog, MatDialogActions } from '@angular/material/dialog';
// import { MAT_DATE_LOCALE } from '@angular/material/core';
// import { MatMenuModule } from '@angular/material/menu';
// import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
// import { MatButtonModule } from '@angular/material/button';
// import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatOptionModule, MatRippleModule } from '@angular/material/core';
// import { MatSelectModule } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';

// import { CommonModule, DatePipe, NgClass } from '@angular/common';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatIconModule } from '@angular/material/icon';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSortModule } from '@angular/material/sort';
// import { MatTableModule } from '@angular/material/table';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { DataSource, SelectionModel } from '@angular/cdk/collections';
// import { BehaviorSubject, Observable, catchError, map, merge } from 'rxjs';
// import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
// import { SharedModule } from '@shared/shared.module';
// import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';

// @Component({
//   selector: 'app-cashbook-list',

//   templateUrl: './cashbook-list.component.html',
//   styleUrl: './cashbook-list.component.scss',
//    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, DatePipe],
//     standalone: true,
//     imports: [
//       MatMenuModule,
//       BreadcrumbComponent,
//       MatTooltipModule,
//       MatButtonModule,
//       MatIconModule,
//       MatTableModule,
//       MatSortModule,
//       NgClass,
//       MatCheckboxModule,
//       FeatherIconsComponent,
//       MatRippleModule,
//       MatProgressSpinnerModule,
//       MatPaginatorModule,
//       DatePipe,
//       MatDatepickerModule,
//       FormsModule,
//       MatFormFieldModule,
//       MatInputModule,
//       MatOptionModule,
//       CommonModule,
//       SharedModule,
//       MatCard,
//     MatDialogActions,
//     MatCardActions,
//     MatCardContent
//     ],
// })
// export class CashbookListComponent {


//   displayedColumns = ['date', 'time', 'description', 'type', 'amount', 'mode', 'reference', 'actions'];
//   dataSource: Cashbook[] = [];
//   totalIncome = 0;
//   totalExpense = 0;

//   constructor(private cashbookService: CashbookService, private dialog: MatDialog) {}

//   ngOnInit() {
//     this.loadData();
//   }


//   loadData() {
//   this.cashbookService.listEntries().subscribe(data => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Reset to 00:00 of today

//     this.dataSource = data
//       // .filter(entry => {
//       //   const entryDate = new Date(entry.date);
//       //   entryDate.setHours(0, 0, 0, 0); // Normalize to midnight
//       //   return entryDate.getTime() === today.getTime();
//       // })
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//     this.calculateSummary();
//   });
// }

//   // loadData() {
//   //   this.cashbookService.listEntries().subscribe(data => {
//   //    this.dataSource = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//   //     this.calculateSummary();
//   //   });
//   // }

//   // calculateSummary() {
//   //   this.totalIncome = this.dataSource
//   //     .filter(e => e.transaction_type === 'INCOME')
//   //     .reduce((sum, e) => sum + e.amount, 0);
//   //   this.totalExpense = this.dataSource
//   //     .filter(e => e.transaction_type === 'EXPENSE')
//   //     .reduce((sum, e) => sum + e.amount, 0);
//   // }

//   calculateSummary() {
//     this.totalIncome = this.dataSource
//       .filter(e => e.transaction_type === 'INCOME')
//       .reduce((sum, e) => sum + Number(e.amount), 0);
  
//     this.totalExpense = this.dataSource
//       .filter(e => e.transaction_type === 'EXPENSE')
//       .reduce((sum, e) => sum + Number(e.amount), 0);
//   }

//   openForm(entry?: Cashbook) {
//     const dialogRef = this.dialog.open(CashbookFormComponent, {
//       width: '400px',
//       data: entry
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       if (result) this.loadData();
//     });
//   }

//   deleteEntry(id: number) {
//     if (confirm('Are you sure to delete?')) {
//       this.cashbookService.deleteEntry(id).subscribe(() => this.loadData());
//     }
//   }

// }
import { Component } from '@angular/core';
import { Cashbook } from '../cashbook';
import { CashbookService } from '../services/cashbook.service';
import { CashbookFormComponent } from '../cash-book/cash-book/cash-book.component';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatButtonModule } from '@angular/material/button';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { SharedModule } from '@shared/shared.module';
import { MatCard, MatCardActions, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-cashbook-list',
  templateUrl: './cashbook-list.component.html',
  styleUrl: './cashbook-list.component.scss',
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
  ],
})
export class CashbookListComponent {
  displayedColumns = [
    'date',
    'time',
    'description',
    'type',
    'amount',
    'mode',
    'reference',
    'actions',
  ];
  dataSource: Cashbook[] = [];
  totalIncome = 0;
  totalExpense = 0;

  constructor(
    private cashbookService: CashbookService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadData();
    this.setupMidnightRefresh(); 
  }

  loadData() {
    this.cashbookService.listEntries().subscribe((data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      this.dataSource = data
        .filter((entry) => {
          const entryDate = new Date(entry.entry_date); 
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime();
        })
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      this.calculateSummary();
    });
  }

  calculateSummary() {
    this.totalIncome = this.dataSource
      .filter((e) => e.transaction_type === 'INCOME')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    this.totalExpense = this.dataSource
      .filter((e) => e.transaction_type === 'EXPENSE')
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }

  openForm(entry?: Cashbook) {
    const dialogRef = this.dialog.open(CashbookFormComponent, {
      width: '400px',
      data: entry,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadData();
    });
  }

  deleteEntry(id: number) {
    if (confirm('Are you sure to delete?')) {
      this.cashbookService.deleteEntry(id).subscribe(() => this.loadData());
    }
  }

  setupMidnightRefresh() {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      1
    );
    const millisUntilMidnight = midnight.getTime() - now.getTime();

    setTimeout(() => {
      this.loadData();
      this.setupMidnightRefresh(); // Reschedule for next day
    }, millisUntilMidnight);
  }
}

