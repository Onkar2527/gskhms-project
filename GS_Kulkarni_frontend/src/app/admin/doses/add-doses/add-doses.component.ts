import { NgFor, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '../../../shared/components/file-upload/file-upload.component';
import { DropdownService } from '../../service/dropdown.service';
import { Doses } from 'app/admin/model/doses.model';
import { DosesService } from 'app/admin/service/doses.service';

@Component({
  selector: 'app-add-doses',
  standalone: true,
  templateUrl: './add-doses.component.html',
  styleUrl: './add-doses.component.scss',
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
    CommonModule
  ],
})
export class AddDosesComponent {
  panleTitle: string = 'Add Doses';
  dosesForm: any;
  id: any;
  doses: Doses = new Doses();
  formdata = {
    id: null,
    name: null
  };
  constructor(private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    public dosesService: DosesService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.dosesData) {
      this.id = urlData.dosesData.id;
      this.doses = <Doses>urlData.dosesData;
    }
  }

  ngOnInit(): void {
    const req = new Doses();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Doses';
    }
    this.dosesForm = this.createContactForm();
    this.setDosesDataForEdit();
    
  }

  setDosesDataForEdit() {
    this.dosesForm.patchValue({
      id:this.doses?.id,
      name:this.doses?.name
    });
  }

  onSubmit() {
    this.dosesService.addDoses(this.dosesForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/doses/doses-list']);
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
