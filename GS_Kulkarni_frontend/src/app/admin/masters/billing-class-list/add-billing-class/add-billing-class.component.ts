import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { BillingClass } from 'app/admin/model/billing-class.model';

import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';

@Component({
  selector: 'app-add-billing-class',
  standalone: true,
  templateUrl: './add-billing-class.component.html',
  styleUrl: './add-billing-class.component.scss',
  imports: [
    SharedModule
  ]
})
export class AddBillingClassComponent {
  panleTitle: string = 'Add BillingClass';
  billingClassForm: any;
  id: any;
  billingClass: BillingClass = new BillingClass();
  formdata = {
    id: null,
    name: null,
    chargePerDay: null
  };
  constructor(private fb: UntypedFormBuilder,
    public masterService: MasterService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.billingClassData) {
      this.id = urlData.billingClassData.id;
      this.billingClass = <BillingClass>urlData.billingClassData;
    }
  }

  ngOnInit(): void {
    const req = new BillingClass();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Billing Class';
    }
    this.billingClassForm = this.createContactForm();
    this.setRouteDataForEdit();
  }

  setRouteDataForEdit() {
    this.billingClassForm.patchValue({
      id: this.billingClass?.id,
      name: this.billingClass?.name,
      charge: this.billingClass?.charge
    });
  }

  onSubmit() {
    this.masterService.addBillingClass(this.billingClassForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/billing-class-list']);
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
      chargePerDay: [
        this.formdata.chargePerDay,
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
