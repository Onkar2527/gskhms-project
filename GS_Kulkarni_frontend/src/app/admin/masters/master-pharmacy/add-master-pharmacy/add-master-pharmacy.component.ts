import { NgFor, CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { DropdownService } from '../../../service/dropdown.service';
import { Pharmacy } from 'app/admin/model/pharmacy.model';
import { PharmacyService } from 'app/admin/service/pharmacy.service';
import { Unit } from 'app/admin/model/unit.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MasterService } from 'app/admin/service/master.service';


@Component({
  selector: 'app-add-master-pharmacy',
  standalone: true,
  templateUrl: './add-master-pharmacy.component.html',
  styleUrl: './add-master-pharmacy.component.scss',
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
    MatAutocompleteModule
  ],
})
export class AddMasterPharmacyComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  panleTitle: string = 'Add Pharmacy';
  pharmacyForm: any;
  id: any;
  pharmacy: Pharmacy = new Pharmacy();
  formdata = {
    id: null,
    medecineName: null,
    unitName: null,
    content: null,
    description: null,
    pharmacyId: null,
    frequency :'',
    dosage :0,
    tillDays:0,
    quantity :0,
    diagnosis :'',
    remark :'',
    physioName:''
  };
  filteredOptions!: Unit[];
  options: Unit[] = [];
  constructor(private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    public pharmacyService: PharmacyService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private masterService:MasterService,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.pharmacyData) {
      this.id = urlData.pharmacyData.id;
      this.pharmacy = <Pharmacy>urlData.pharmacyData;
    }
  }
  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.name.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    const req = new Pharmacy();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Pharmacy';
    }
    this.pharmacyForm = this.createContactForm();
    this.setPharmacyDataForEdit();
    this.loadUnits();
    
  }

  loadUnits()
  {
    this.masterService.getUnitByCriteria({}).subscribe((data:any)=>{
      this.options=data.data;

    })
  }
  setPharmacyDataForEdit() {
    
    this.pharmacyForm.patchValue({
      id:this.pharmacy?.id,
      medecineName:this.pharmacy?.medecineName,
      unitName:this.pharmacy?.unitName,
      content:this.pharmacy?.content,
      description:this.pharmacy?.description,
      pharmacyId:this.pharmacy?.pharmacyId,
      frequency:this.pharmacy?.frequency,
      dosage :this.pharmacy?.dosage,
      tillDays:this.pharmacy?.tillDays,
      quantity  :this.pharmacy?.quantity ,
      diagnosis :this.pharmacy?.diagnosis,
      remark:this.pharmacy?.remark,
    });
  }

  onSubmit() {
    this.pharmacyService.addPharmacy(this.pharmacyForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/pharmacy-list']);
      } else {
        this.openSnackBar(result['message']);
      }
    });
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.formdata.id],
      medecineName: [
        this.formdata.medecineName,
        [Validators.required],
      ],
      unitName: [this.formdata.unitName],
      content: [this.formdata.content],
      description: [this.formdata.description],
      frequency : [this.formdata.frequency ],
      dosage : [this.formdata.dosage ],
      tillDays : [this.formdata.tillDays ],
      quantity : [this.formdata.quantity ],
      diagnosis : [this.formdata.diagnosis ],
      remark : [this.formdata.remark  ],
      physioName : [this.formdata.physioName  ],
    });
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
