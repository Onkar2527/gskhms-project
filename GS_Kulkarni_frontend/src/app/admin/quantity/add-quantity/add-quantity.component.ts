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
import { Quantity } from 'app/admin/model/quantity.model';
import { QuantityService } from 'app/admin/service/quantity.service';

@Component({
  selector: 'app-add-quantity',
  standalone: true,
  templateUrl: './add-quantity.component.html',
  styleUrl: './add-quantity.component.scss',
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
export class AddQuantityComponent {
  panleTitle: string = 'Add Quantity';
  quantityForm: any;
  id: any;
  quantity: Quantity = new Quantity();
  formdata = {
    id: null,
    name: null
  };
  constructor(private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    public quantityService: QuantityService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.quantityData) {
      this.id = urlData.quantityData.id;
      this.quantity = <Quantity>urlData.quantityData;
    }
  }

  ngOnInit(): void {
    const req = new Quantity();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Quantity';
    }
    this.quantityForm = this.createContactForm();
    this.QetquantityDataForEdit();
    
  }

  QetquantityDataForEdit() {
    this.quantityForm.patchValue({
      id:this.quantity?.id,
      name:this.quantity?.name
    });
  }

  onSubmit() {
    this.quantityService.addQuantity(this.quantityForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/quantity/quantity-list']);
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
