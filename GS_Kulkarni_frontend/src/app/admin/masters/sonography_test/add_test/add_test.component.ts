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
import { SonographyTest } from 'app/admin/model/sonography.model';

@Component({
  selector: 'app-add-sonography',
  templateUrl: './add_test.component.html',
  styleUrl: './add_test.component.scss',
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
export class SonographyComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  panleTitle: string = 'Add sonography';
  SonographyTestForm: any;
  
  id: any;
  sonographyTest: SonographyTest = new SonographyTest();
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
    if (urlData?.sonographyTestData) {
      this.id = urlData.sonographyTestData.id;
      this.sonographyTest = <SonographyTest>urlData.sonographyTestData;
    }
  }

  
  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.name.toLowerCase().includes(filterValue));
  }
  ngOnInit(): void {
    const req = new SonographyTest();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit sonography';
      
    }
    this.SonographyTestForm = this.createContactForm();
    this.setRouteDataForEdit();
  }
  
  setRouteDataForEdit() {
    this.SonographyTestForm.patchValue({
      id:this.sonographyTest?.id,
      name:this.sonographyTest?.name,
      charges:this.sonographyTest?.charges
    });
  }

  onSubmit() {
    let data={
      id:this.id,
      name:this.SonographyTestForm.value.name,
      charges:this.SonographyTestForm.value.charges,
      description: this.SonographyTestForm.value.description,
      type:'Q'
    }
    this.masterService.addPathologyTest(data).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/sonography-list']);
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
