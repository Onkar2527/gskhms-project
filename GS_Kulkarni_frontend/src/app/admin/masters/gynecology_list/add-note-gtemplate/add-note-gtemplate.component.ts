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
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { GNoteTemplate } from 'app/admin/model/gnoteTemplate.model';

import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { Unit } from 'app/admin/model/unit.model';


@Component({
  selector: 'app-add-note-gtemplate',
  templateUrl: './add-note-gtemplate.component.html',
  styleUrl: './add-note-gtemplate.component.scss',
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
export class AddGTemplateComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  panleTitle: string = 'Add Note-Template';
  gnoteTemplateForm: any;
  
  id: any;
  gnoteTemplate: GNoteTemplate = new GNoteTemplate();
  formdata = {
    id: null,
    operation_name:null,
    pre_op:null,
    procedure_op:null,
    post_op:null,
    addition_description:null,
    treatment:null

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
    
    if (urlData?.gNoteTemplateData) {
      this.id = urlData.gNoteTemplateData.id;
      this.gnoteTemplate = <GNoteTemplate>urlData.gNoteTemplateData;
    }
  }

  
  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.name.toLowerCase().includes(filterValue));
  }
  ngOnInit(): void {
    const req = new GNoteTemplate();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Note-Template';
      
    }
    this.gnoteTemplateForm = this.createContactForm();
    this.setRouteDataForEdit();
    
  }
  
 

  setRouteDataForEdit() {
    
    this.gnoteTemplateForm.patchValue({
      id:this.gnoteTemplate?.id,
      operation_name:this.gnoteTemplate?.operation_name,
      pre_op:this.gnoteTemplate?.pre_op,
      procedure_op:this.gnoteTemplate?.procedure_op,
      post_op:this.gnoteTemplate?.post_op,
      addition_description:this.gnoteTemplate?.addition_description,
      treatment:this.gnoteTemplate?.treatment,

    });
  }

  onSubmit() {
    let data={
      id:this.id,
      
      operation_name:this.gnoteTemplateForm.value.operation_name,
      pre_op:this.gnoteTemplateForm.value.pre_op,
      procedure_op:this.gnoteTemplateForm.value.procedure_op,
      post_op:this.gnoteTemplateForm.value.post_op,
      addition_description:this.gnoteTemplateForm.value.addition_description,
      treatment:this.gnoteTemplateForm.value.treatment,

      
    }
    this.masterService.addGNoteTemplateTest(data).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/gynecology-notes-template']);
      } else {
        this.openSnackBar(result['message']);
      }
    });
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.formdata.id],
      operation_name: [
        this.formdata.operation_name,
       
      ],pre_op: [
        this.formdata.pre_op,
       
      ],procedure_op: [
        this.formdata.procedure_op,
       
      ],post_op: [
        this.formdata.post_op,
       
      ],addition_description: [
        this.formdata.addition_description,
       
      ],treatment: [
        this.formdata.treatment,
       
      ]
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
