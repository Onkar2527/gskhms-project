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
import { NoteTemplate } from 'app/admin/model/noteTemplate.model';

import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { Unit } from 'app/admin/model/unit.model';


@Component({
  selector: 'app-add-note-template',
  templateUrl: './add-note-template.component.html',
  styleUrl: './add-note-template.component.scss',
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
export class AddNoteTemplateComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  panleTitle: string = 'Add Note-Template';
  noteTemplateForm: any;
  
  id: any;
  noteTemplate: NoteTemplate = new NoteTemplate();
  formdata = {
    id: null,
    noteName: null,
    noteDescription: null
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
    if (urlData?.noteTemplateData) {
      this.id = urlData.noteTemplateData.id;
      this.noteTemplate = <NoteTemplate>urlData.noteTemplateData;
    }
  }

  
  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.name.toLowerCase().includes(filterValue));
  }
  ngOnInit(): void {
    const req = new NoteTemplate();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Note-Template';
      
    }
    this.noteTemplateForm = this.createContactForm();
    this.setRouteDataForEdit();
    
  }
  
 

  setRouteDataForEdit() {
    
    this.noteTemplateForm.patchValue({
      id:this.noteTemplate?.id,
      noteName:this.noteTemplate?.noteName,
      noteDescription:this.noteTemplate?.noteDescription
    });
  }

  onSubmit() {
    let data={
      id:this.id,
      noteName:this.noteTemplateForm.value.noteName,
      noteDescription:this.noteTemplateForm.value.noteDescription,
      
    }
    this.masterService.addNoteTemplateTest(data).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/note-template-list']);
      } else {
        this.openSnackBar(result['message']);
      }
    });
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.formdata.id],
      noteName: [
        this.formdata.noteName,
        [Validators.required],
      ],noteDescription: [
        this.formdata.noteDescription,
        [Validators.required],
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
