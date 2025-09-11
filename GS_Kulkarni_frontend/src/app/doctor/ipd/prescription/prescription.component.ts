import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose, MatDialog } from '@angular/material/dialog';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePipe, NgFor, NgClass } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from 'app/admin/service/master.service';
import { Unit } from 'app/admin/model/unit.model';
import { Pharmacy } from 'app/admin/model/pharmacy.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { PrescriptionDetail } from 'app/doctor/opd/appointments/prescription-details.model';
import { Direction } from '@angular/cdk/bidi';
import { PrintPrescriptionComponent } from '../print-prescription/print-prescription.component';

export interface DialogData {
  id: number;
  action: string;
  appointments: Appointments;
}

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogClose,
    MatTabsModule,
    NgFor,
    MatOptionModule,
    MatSelectModule,
    FeatherIconsComponent,
    DatePipe,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatAutocompleteModule,
  ],
})
export class PrescriptionComponent implements OnInit{
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('input1') input1!: ElementRef<HTMLInputElement>;
  isDetails = false;
  appointmentsForm?: UntypedFormGroup;
  
  templateForm: any;
  // @Input() prescriptionDetails:any;
  @Input() appoinment_id:any;
  @Input() appoinment:any;

  @Output() changePrescription = new EventEmitter();

  filteredOptions!: Unit[];
  options: Unit[] = [];
  filteredOptionsPharmacy!: Pharmacy[];
  optionsPharmacy: Pharmacy[] = [];
  templateCombo$:any[]=[];

  prescriptionDetails:any;
  existingPrescriptionDetails!: any;

  columns!: any[];
  displayedColumns!: string[];
  groupByColumns: string[] = [];
  public dataSource = new MatTableDataSource<any>([]);

  constructor(
    public dialogRef: MatDialogRef<PrescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public appointmentsService: AppointmentsService,
    private masterService:MasterService,private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
  ) {
    this.columns = [
    {
      field: 'prescriptionDate',
      name: 'Date'
    }, {
      field: 'medicineName',
      name: 'Medicine'
    }, {
      field: 'unitName',
      name: 'Unit Name'
    }, {
      field: 'frequency',
      name: 'Frequency'
    }, {
      field: 'dosage',
      name: 'Dosage'
    }, {
      field: 'tillDay',
      name: 'Till Days'
    }, {
      field: 'quantity',
      name: 'Quantity'
    }];
    this.displayedColumns = this.columns.map(column => column.field);
    this.groupByColumns = ['prescriptionDate'];
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      templateId:[''],
      medicineName:[''],
      unitName:[''],
      frequency:[''],
      dosage:[0],
      tillDays:[0],
      quantity:[0]
    });
  }

  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  
  ngOnInit() {
    this.templateForm = this.createContactForm();
    this.loadUnits();
    this.loadMedicine();
    this.loadTestDetails();
    this.loadTemplate();
  }

  loadTemplate(){
    this.masterService.getAllTemplate({}).subscribe((data:any)=>{
      this.templateCombo$=data.data;
    })
  }

  loadUnits(){
    this.masterService.getUnitByCriteria({}).subscribe((data:any)=>{
      this.options=data.data;
    })
  }
  
  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.name.toLowerCase().includes(filterValue));
  }

  filterMedicine(): void {
    const filterValue = this.input1.nativeElement.value.toLowerCase();
    this.filteredOptionsPharmacy = this.optionsPharmacy.filter(o => o.medecineName.toLowerCase().includes(filterValue));
  }

  loadMedicine(){
    this.masterService.getMedicineByCriteria().subscribe((data:any)=>{
      this.optionsPharmacy=data.data;
    })
  }
 
  pharmacySelected(val:any){
    let pharmacy=this.optionsPharmacy.find((obj:any)=>obj.medecineName===val);
    if(pharmacy){
      this.templateForm.patchValue({
        unitName:pharmacy?.unitName,
        frequency:pharmacy?.frequency,
        dosage:pharmacy?.dosage,
        tillDays:pharmacy?.tillDays,
        quantity:pharmacy?.quantity,
      })
    }
  }
  
  onSubmit() {
    this.masterService.savePrescriptionDetails(this.prescriptionDetails).subscribe((result: any) => {
      this.prescriptionDetails = null;
      this.loadTestDetails();
    });
  }

  templatedet:any[]=[];

  addTemplateDetails(){
    if(!this.templateForm.get('templateId').value)
      return
    this.templatedet=[];
    this.masterService.getTemplateDetails({templateId:this.templateForm.get('templateId').value})
    .subscribe((res:any)=>{
      this.templatedet=res.data;
      let count = 0;
      for(let obj of this.templatedet){
          count++;
          let data={
            medicineName:obj.medicineName,
            unitName:obj.unitName,
            frequency:obj.frequency,
            dosage:obj.dosage,
            tillDay:obj.tillDays,
            quantity:obj.quantity,
            appointmentId: this.appoinment_id
          }
          this.prescriptionDetails.push(data);
          // this.masterService.addPrescriptionDetails(data).subscribe((result: any) => {
          //   if(this.templatedet.length == count){
          //     this.loadTestDetails();
          //   }
          // });
        }
    })
  }

  addDetails(){
    let data={
      id:0,
      medicineName:this.templateForm.value.medicineName,
      unitName:this.templateForm.value.unitName,
      frequency:this.templateForm.value.frequency,
      dosage:this.templateForm.value.dosage,
      tillDay:this.templateForm.value.tillDays,
      quantity:this.templateForm.value.quantity,
      appointmentId: this.appoinment_id
    }
    this.prescriptionDetails.push(data);
    this.templateForm.patchValue({
      medicineName: '',
      unitName: '',
      frequency: '',
      dosage: '0',
      tillDays: '0',
      quantity: '0'
    })
  }

  loadTestDetails(){
    let data = {
        "appointmentId": this.appoinment_id
      }
    this.prescriptionDetails = [];  
    this.masterService.getPrescriptionDetails(data).subscribe((res:any)=>{
      this.existingPrescriptionDetails = res.data;
      this.dataSource.data = this.addGroups(this.existingPrescriptionDetails, this.groupByColumns);   
      this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);   
      this.changePrescription.emit(true);
    })
  }

   // below is for grid row grouping
   customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
        if (!(row instanceof Group)) {
          return false;
        }
        let match = true;
        this.groupByColumns.forEach(column => {
          if (!data[column]) {
            match = false;
          }
        });
        return match;
      }
    );

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row: { expanded: boolean; }) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();  // bug here need to fix
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map(
        row => {
          const result: any = {};
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = groupByColumns[level];
    let subGroups: any[] = [];
    groups.forEach((group: any) => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a: any[], key: { (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string; (value: any, replacer?: (number | string)[] | null, space?: string | number): string; (arg0: any): any; }) {
    const seen: any = {};
    return a.filter((item: any) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index: any, item: { level: boolean; }): boolean {
    return item.level;
  }

  deleteTemplateDtl(obj: any){
    this.prescriptionDetails.splice(this.prescriptionDetails.indexOf(obj), 1);
  }
 
  cancel() {
    window.history.back();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  printPrescription(date: any){
    let tempDirection: Direction;
    if (localStorage?.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    this.dialogRef.close();
    this.dialog.open(PrintPrescriptionComponent, {
      id: 'Print',
      data: {
        id: this.appoinment_id,
        appoinment: this.appoinment,
        prescriptionDate: date
      },
      direction: tempDirection,
      height: '80%',
      width: '80%'
    });
  }

}

export class Group {
  level: number = 0;
  parent!: Group;
  expanded: boolean = true;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}