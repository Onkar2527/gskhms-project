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
import { HospitalService } from '../../service/hospital.service';
import { Hospital } from '../../model/hospital.model';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-add-hospital',
  standalone: true,
  templateUrl: './add-hospital.component.html',
  styleUrl: './add-hospital.component.scss',
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
export class AddHospitalComponent {
  panleTitle: string = 'Add Hospital';
  hospitalForm: any;
  id: any;
  hospital: Hospital = new Hospital();
  formdata = {
    id: null,
    name: null,
    hospitalCode: null,
    regNo: null,
    licNo: null,
    mobileNumber: null,
    email: null,
    address: null,
    area: null,
    taluka: null,
    district: null,
    state: null,
    pinCode: null,
    status: null,
    labServices: null,
    xrayServices: null,
    ipdAvailable: null,
    discountApplicable: null,
    insuranceAvailable: null
  };
  constructor(private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    public hospitalService: HospitalService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id']; // Access the 'id' parameter from the URL
    });
    const req = new Hospital();
    req.id = this.id;
    this.hospital.id = this.id;
    this.hospitalForm = this.createContactForm();
    if(this.id != -1){
      this.panleTitle = 'Edit Hospital';
      this.getHospital();
    }
  }
  
  getHospital() {
      this.hospitalService.getHospitalByCriteria(this.hospital).subscribe((resp: any) => {
      this.hospital = resp.data[0];
      this.hospitalForm.patchValue({
        id:this.hospital?.id,
        name: this.hospital?.name,
        hospitalCode: this.hospital?.hospitalCode,
        regNo: this.hospital?.regNo,
        licNo: this.hospital?.licNo,
        mobileNumber: this.hospital?.mobileNumber,
        email: this.hospital?.email,
        address: this.hospital?.address,
        area: this.hospital?.area,
        taluka: this.hospital?.taluka,
        district: this.hospital?.district,
        state: this.hospital?.state,
        pincode: this.hospital?.pinCode,
        status: this.hospital?.status ? this.hospital?.status : 'Active',
        hospitalId: this.hospital?.hospitalId,
        labServices: this.hospital?.labServices == 'Y' ? true: false,
        xrayServices: this.hospital?.xrayServices == 'Y' ? true: false,
        ipdServices: this.hospital?.ipdServices == 'Y' ? true: false,
        discountApplicable: this.hospital?.discountApplicable == 'Y' ? true: false,
        insuranceAvailable: this.hospital?.insuranceAvailable == 'Y' ? true: false,
      })
    });
  }

  onSubmit() {
    this.hospitalForm.patchValue({
      labServices: this.hospitalForm.get('labServices').value == true ? 'Y' : 'N',
      xrayServices:  this.hospitalForm.get('xrayServices').value == true ? 'Y' : 'N',
      ipdServices:  this.hospitalForm.get('ipdServices').value == true ? 'Y' : 'N',
      discountApplicable: this.hospitalForm.get('discountApplicable').value == true ? 'Y' : 'N',
      insuranceAvailable: this.hospitalForm.get('insuranceAvailable').value == true ? 'Y' : 'N',
    });
    if(this.id == -1){
      this.hospitalForm.id = null;
      this.hospitalForm.pa
      this.hospitalService.addHospital(this.hospitalForm.value).pipe(
        catchError(() => {
          this.openSnackBar('Error occurred to add');
          return '';
        })
      ).subscribe((result: any) => {
          this.openSnackBar(result['message']);
          this.router.navigate(['/admin/hospital/hospital-list']);
      });
    }else{
      this.hospitalService.updateHospital(this.hospitalForm.value).pipe(
        catchError(() => {
          this.openSnackBar('Error occurred to add');
          return '';
        })
      ).subscribe((result: any) => {
          this.openSnackBar(result['message']);
          this.router.navigate(['/admin/hospital/hospital-list']);
      });
    }
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.formdata.id],
      name: [
        this.formdata.name,
        [Validators.required, Validators.pattern('[a-z A-Z]+')],
      ],
      hospitalCode: [{value: this.formdata.hospitalCode, disabled: this.id != -1}, Validators.required],
      regNo: [this.formdata.regNo, Validators.required],
      licNo: [this.formdata.licNo, Validators.required],
      mobileNumber: [this.formdata.mobileNumber, [Validators.required]],
      email: [this.formdata.email, [Validators.required, Validators.email, Validators.minLength(5)]],
      area:[this.formdata.area],
      taluka:[this.formdata.taluka],
      district:[this.formdata.district],
      state:[this.formdata.state],
      pinCode:[this.formdata.pinCode],
      address:[this.formdata.address],
      status:[this.formdata.status],
      isChecked:[false],
      labServices: [false],
      xrayServices: [false],
      ipdServices: [false],
      discountApplicable: [false],
      insuranceAvailable: [false]
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
