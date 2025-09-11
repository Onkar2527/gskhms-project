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
import { SharedModule } from '@shared/shared.module';
import { Pharmacy } from 'app/admin/model/pharmacy.model';
import { AnesthesiaType } from 'app/admin/model/anesthesia-type.model';
import { Unit } from 'app/admin/model/unit.model';

import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';


@Component({
  selector: 'app-add-anesthesia-type',
  standalone: true,
  
  templateUrl: './add-anesthesia-type.component.html',
  styleUrl: './add-anesthesia-type.component.scss',
  imports: [
    SharedModule
  ]
})
export class AddAnesthesiaTypeComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('input1') input1!: ElementRef<HTMLInputElement>;
  panleTitle: string = 'Add Anesthesia Type';
  templateForm: any;
  id: any;
  template: AnesthesiaType = new AnesthesiaType();
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
      this.template = <AnesthesiaType>urlData.templateData;
      
    }
  }

 
  ngOnInit(): void {
    const req = new AnesthesiaType();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Anesthesia Type';
    }
    this.templateForm = this.createContactForm();
    this.setRouteDataForEdit();
    
  }
  
  setRouteDataForEdit() {
    
    this.templateForm.patchValue({
      id:this.template?.id,
      name:this.template?.name
    });
  }

  onSubmit() {
    this.masterService.addAnesthesiaType(this.templateForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/anesthesia-type-list']);
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
      ]
    });
  }
  templateDetails$!:any;
 


 
 
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
