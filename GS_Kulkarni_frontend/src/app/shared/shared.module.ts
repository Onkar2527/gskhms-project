import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { CommonModule, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FeatherIconsComponent } from './components/feather-icons/feather-icons.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

import {MatGridListModule} from '@angular/material/grid-list';
import { NgxPrintModule } from 'ngx-print';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule ,
    MatDialogClose,
    NgFor,
    NgIf,
    BreadcrumbComponent,
    FileUploadComponent,
    MatCheckboxModule,
    CommonModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
    MatMenuModule,
    MatGridListModule,
    NgxBarcode6Module,
    NgxPrintModule,
    NgxMatTimepickerModule
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule ,
    MatDialogClose,
    NgFor,
    NgIf,
    BreadcrumbComponent,
    FileUploadComponent,
    MatCheckboxModule,
    CommonModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule,
    MatGridListModule,
    NgxBarcode6Module,
    NgxPrintModule,
    NgxMatTimepickerModule
  ],
  providers: [],
})
export class SharedModule { }