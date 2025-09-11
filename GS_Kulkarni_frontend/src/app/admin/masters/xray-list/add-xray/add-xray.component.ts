import { CommonModule, NgFor } from '@angular/common';
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
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { PathologyTest } from 'app/admin/model/pathologyTest.model';

import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Unit } from 'app/admin/model/unit.model';

@Component({
  selector: 'app-add-xray',
  templateUrl: './add-xray.component.html',
  styleUrl: './add-xray.component.scss',
  standalone: true,
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
    MatExpansionModule,
  
    MatAutocompleteModule
  ]
})
export class AddXrayComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  panleTitle: string = 'Add X-Ray';
  pathologyTestForm: any;
  
  id: any;
  pathologyTest: PathologyTest = new PathologyTest();
  formdata = {
    id: null,
    name: null,
    charges: null
  };
  filteredOptions!: Unit[];
  options: Unit[] = [];
  constructor(private fb: UntypedFormBuilder,
    public masterService: MasterService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.pathologyTestData) {
      this.id = urlData.pathologyTestData.id;
      this.pathologyTest = <PathologyTest>urlData.pathologyTestData;
    }
  }

  
  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.name.toLowerCase().includes(filterValue));
  }
  ngOnInit(): void {
    const req = new PathologyTest();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit X-Ray';
      
    }
    this.pathologyTestForm = this.createContactForm();
    this.setRouteDataForEdit();
  }
  
  setRouteDataForEdit() {
    this.pathologyTestForm.patchValue({
      id:this.pathologyTest?.id,
      name:this.pathologyTest?.name,
      charges:this.pathologyTest?.charges
    });
  }

  onSubmit() {
    let data={
      id:this.id,
      name:this.pathologyTestForm.value.name,
      charges:this.pathologyTestForm.value.charges,
      description: this.pathologyTestForm.value.description,
      type:'X'
    }
    this.masterService.addPathologyTest(data).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/x-ray-list']);
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
      ],charges: [
        this.formdata.charges,
        [Validators.required],
      ],
      description: ['']
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
