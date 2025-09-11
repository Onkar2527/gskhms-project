import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { Pharmacy } from 'app/admin/model/pharmacy.model';
import { Template } from 'app/admin/model/template.model';
import { Unit } from 'app/admin/model/unit.model';

import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';


@Component({
  selector: 'app-add-template',
  standalone: true,
  
  templateUrl: './add-template.component.html',
  styleUrl: './add-template.component.scss',
  imports: [
    BreadcrumbComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    FileUploadComponent,
    MatButtonModule,
    NgFor,
    MatCheckboxModule,
    CommonModule,
    MatAutocompleteModule,
    MatIconModule
  ]
})
export class AddTemplateComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('input1') input1!: ElementRef<HTMLInputElement>;
  panleTitle: string = 'Add Template';
  templateForm: any;
  id: any;
  template: Template = new Template();
  formdata = {
    id: null,
    name: null
  };
  filteredOptions!: Unit[];
  options: Unit[] = [];
  filteredOptionsPharmacy!: Pharmacy[];
  optionsPharmacy: Pharmacy[] = [];
  constructor(private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    public masterService: MasterService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.templateData) {
      this.id = urlData.templateData.id;
      this.template = <Template>urlData.templateData;
      
    }
  }
  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.name.toLowerCase().includes(filterValue));
  }

  filterMedicine(): void {
    const filterValue = this.input1.nativeElement.value.toLowerCase();
    this.filteredOptionsPharmacy = this.optionsPharmacy.filter(o => o.medecineName.toLowerCase().includes(filterValue));
  }
  pharmacySelected(val:any)
  {
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
    console.log(pharmacy)
  }
  ngOnInit(): void {
    const req = new Template();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Template';
    }
    this.templateForm = this.createContactForm();
    this.setRouteDataForEdit();
    this.loadUnits();
    this.loadMedicine();
  this.loadTestDetails();
  }
  loadUnits()
  {
    this.masterService.getUnitByCriteria({}).subscribe((data:any)=>{
      this.options=data.data;

    })
  }

  loadMedicine()
  {
    this.masterService.getMedicineByCriteria().subscribe((data:any)=>{
      this.optionsPharmacy=data.data;

    })
  }
  setRouteDataForEdit() {
    
    this.templateForm.patchValue({
      id:this.template?.id,
      name:this.template?.name
    });
  }

  onSubmit() {
    this.masterService.addTemplate(this.templateForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/template-list']);
      } else {
        this.openSnackBar(result['message']);
      }
    });
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.formdata.id],
      name: [
        this.formdata.name,
        [Validators.required],
      ],
      medicineName:[''],
      unitName:[''],
      frequency:[''],
      dosage:[0],
      tillDays:[0],
      quantity:[0]
    });
  }
  templateDetails$!:any;
 addDetails(){
    let data={
      id:0,
      medicineName:this.templateForm.value.medicineName,
      unitName:this.templateForm.value.unitName,
      frequency:this.templateForm.value.frequency,
      dosage:this.templateForm.value.dosage,
      tillDays:this.templateForm.value.tillDays,
      quantity:this.templateForm.value.quantity,
      templateId:this.id
    }

  
    this.masterService.addTemplateDetails(data).subscribe((result: any) => {
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
  loadTestDetails()
  {
    let data={
        "templateId": this.id
      }
      this.templateDetails$=[];
    this.masterService.getTemplateDetails(data).subscribe((res:any)=>{
      this.templateDetails$=res.data;
    })
  }

  deleteTemplateDtl(id:any){
    this.masterService.deleteTemplateDetails(id).subscribe((res:any)=>{
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
