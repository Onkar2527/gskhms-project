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
import { Consume } from 'app/admin/model/consume.model';
import { ConsumeService } from 'app/admin/service/consume.service';

@Component({
  selector: 'app-add-consume',
  standalone: true,
  templateUrl: './add-consume.component.html',
  styleUrl: './add-consume.component.scss',
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
export class AddConsumeComponent {
  panleTitle: string = 'Add Consume';
  consumeForm: any;
  id: any;
  consume: Consume = new Consume();
  formdata = {
    id: null,
    name: null
  };
  constructor(private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    public consumeService: ConsumeService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.consumeData) {
      this.id = urlData.consumeData.id;
      this.consume = <Consume>urlData.consumeData;
    }
  }

  ngOnInit(): void {
    const req = new Consume();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Consume';
    }
    this.consumeForm = this.createContactForm();
    this.setConsumeDataForEdit();
    
  }

  setConsumeDataForEdit() {
    this.consumeForm.patchValue({
      id:this.consume?.id,
      name:this.consume?.name
    });
  }

  onSubmit() {
    this.consumeService.addConsume(this.consumeForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/consume/consume-list']);
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
