import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AppointmentsService } from '../appointments.service';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Appointments } from '../appointments.model';
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
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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
  @Input() prescriptionDetails:any;
  @Input() appoinment_id:any;
  @Output() changePrescription = new EventEmitter();

  filteredOptions!: Unit[];
  options: Unit[] = [];
  filteredOptionsPharmacy!: Pharmacy[];
  optionsPharmacy: Pharmacy[] = [];
  templateCombo$:any[]=[];
  constructor(
    public dialogRef: MatDialogRef<PrescriptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public appointmentsService: AppointmentsService,
    private masterService:MasterService,private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder
  ) {}

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
  
  onSubmit(){

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
          this.masterService.addPrescriptionDetails(data).subscribe((result: any) => {
            if(this.templatedet.length == count){
              this.loadTestDetails();
            }
          });
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
    this.masterService.addPrescriptionDetails(data).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {   
        this.loadTestDetails();
        this.templateForm.patchValue({
          medicineName:'',
          unitName:'',
          frequency:'',
          dosage:'0',
          tillDays:'0',
          quantity:'0'
        })
      } 
    });
  }

  loadTestDetails(){
    let data = {
        "appointmentId": this.appoinment_id
      }
    this.prescriptionDetails=[];
    this.masterService.getPrescriptionDetails(data).subscribe((res:any)=>{
      this.prescriptionDetails=res.data;
      this.changePrescription.emit(true);
    })
  }

  deleteTemplateDtl(id:any){
    this.masterService.deletePrescriptionDetails(id).subscribe((res:any)=>{
      this.loadTestDetails();
    })
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
  
}
