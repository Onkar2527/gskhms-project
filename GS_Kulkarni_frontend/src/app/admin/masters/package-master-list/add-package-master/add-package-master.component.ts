import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { PackageMaster } from 'app/admin/model/packageMaster.model';

import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { Unit } from 'app/admin/model/unit.model';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '@shared/shared.module';
import { DepartmentList } from 'app/admin/departments/department-list/department-list.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Services } from 'app/admin/model/services.model';

@Component({
  selector: 'app-add-package-master',
  templateUrl: './add-package-master.component.html',
  styleUrl: './add-package-master.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatDialogClose,
    NgFor,
    MatOptionModule,
    MatSelectModule
  ]
})
export class AddPackageMasterComponent {
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  panleTitle: string = 'Add Package Master';
  packageMasterForm: any;
  departments$: any;
  // services$: any;


  id: any;
  packageMaster: PackageMaster = new PackageMaster();
  formdata = {
    id: null,
    name: null,
    charges: null,
    packageType: 'T',
    deptId: null,
  };
  filteredOptions!: Unit[];
  serviceOptions: any[] = [];
  services$: any[]= [];
  constructor(private fb: UntypedFormBuilder,
    public masterService: MasterService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService,
    // public dropdownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.packageMasterData) {
      this.id = urlData.packageMasterData.id;
      this.packageMaster = <PackageMaster>urlData.packageMasterData;
    }
  }



  ngOnInit(): void {
    // this.addPackageDetails();
    this.getDepartments();
    this.getServices();
    const req = new PackageMaster();
    req.id = this.id;
    if (this.id) {
      this.panleTitle = 'Edit Package Master';

    }
    // this.loadServices();
    if (this.id != 0)
      this.loadPackageDetails();
    this.packageMasterForm = this.createContactForm();
    this.setRouteDataForEdit();

    this.packageMasterForm = this.fb.group({
      serviceId: [[]], // default as an empty array
      name: [this.formdata.name, [Validators.required]],
      charges: [this.formdata.charges, [Validators.required]],
      packageType: [this.formdata.packageType, [Validators.required]],
      deptId: [this.formdata.deptId],
    });

  }
  // loadServices() {
  //   this.masterService.getPathologyTesByCriteria({}).subscribe((data: any) => {
  //     this.serviceOptions = data.data;

  //   })
  // }



  setRouteDataForEdit() {
    this.packageMasterForm.patchValue({
      id: this.packageMaster?.id,
      name: this.packageMaster?.name,
      charges: this.packageMaster?.charges,
      packageType: this.packageMaster?.packageType,
      deptId: this.packageMaster?.deptId,
    });
  }

  onSubmit() {
    let data = {
      id: this.id,
      name: this.packageMasterForm.value.name,
      charges: this.packageMasterForm.value.charges,
      packageType: this.packageMasterForm.value.packageType,
      deptId: this.packageMasterForm.value.deptId,
    }
    this.masterService.addPackageMaster(data).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {

        this.openSnackBar(result['message']);
        if (!this.id) {
          this.id = result['data'].id;
          this.loadPackageDetails();
        }
        else
          this.router.navigate(['/admin/master/package-master-list']);
      } else {
        this.openSnackBar(result['message']);
      }
    });
  }

  getDepartments() {
    const data = new DepartmentList();
    // data.status = 'Active';
    this.dropDownService.departmentCombo(data).subscribe((result: any) => {
      this.departments$ = result.data;
      console.log("department combo ", this.departments$)
    });
  }


    getServices() {
      const data = new Services();
      // data.status = 'Active';
      // data.hospitalId = this.hospitalId;
      this.dropDownService.servicesCombo(data).subscribe((result: any) => {
        this.serviceOptions = result.data;
      });
    }

  createContactForm(): UntypedFormGroup {

    return this.fb.group({
      id: [this.formdata.id],
      name: [
        this.formdata.name,
        [Validators.required],
      ], charges: [
        this.formdata.charges,
        [Validators.required],
      ], packageType: [
        this.formdata.packageType,
        [Validators.required],
      ],
      deptId: [
        this.formdata.deptId,
        [Validators.required],
      ],
      serviceId: [
        0
      ],
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

  packageDetails$!: any;
  type!: any;

  // addPackageDetails() {
  //   const selectedServiceIds = this.packageMasterForm.value.serviceId; // this is now an array

  //   if (!selectedServiceIds || selectedServiceIds.length === 0) {
  //     return;
  //   }

  //   const dataArray = selectedServiceIds.map((serviceId: number) => {
  //     const service = this.serviceOptions.find((obj: any) => obj.id === (serviceId));
  //     return {
  //       id: 0,
  //       serviceId: serviceId,
  //       packageId: this.id,
  //       type: service?.type || ''
  //     };
  //   });

  //   // You can call API for each OR batch them (if your backend supports it)
  //   dataArray.forEach((data: { id: number; serviceId: number; packageId: number; type: string }) => {
  //     this.masterService.addPackageDetails(data).subscribe((result: any) => {
  //       if (result['message'] === 'Data Saved Successfully') {
  //         this.loadPackageDetails();
  //       }
  //     });
  //   });

  //   // Reset the selection after saving
  //   this.packageMasterForm.patchValue({
  //     serviceId: [],

  //   });
  // }

  addPackageDetails() {
    const selectedServiceIds = this.packageMasterForm.value.serviceId;
  
    if (!selectedServiceIds || selectedServiceIds.length === 0) {
      return;
    }
  
    const dataArray = selectedServiceIds.map((serviceId: number) => {
      const service = this.serviceOptions.find((obj: any) => obj.id === serviceId);
      return {
        id: 0,
        serviceId: serviceId,
        packageId: this.id,
        type: service?.type || '',
        charges: service?.rate || 0 // <-- Include charges here
      };
    });
  
   
      dataArray.forEach((data: { id: number; serviceId: number; packageId: number; type: string; charges: number }) => {
        this.masterService.addPackageDetails(data).subscribe((result: any) => {
          if (result['message'] === 'Data Saved Successfully') {
            this.loadPackageDetails();
          }
      });
    });
  
    this.packageMasterForm.patchValue({
      serviceId: [],
    });
  }
  


  getServiceName(id: any) {

    return this.serviceOptions.find((obj: any) => obj.id === id).name || '';
  }


  getTotalCharges(): number {
    return this.packageDetails$?.reduce((acc: number, item: any) => acc + (item.charges || 0), 0) || 0;
  }



  // addPackageDetails(){

  //   if(parseInt(this.packageMasterForm.value.serviceId)===0)
  //     {
  //       return
  //     }

  //     this.type=this.serviceOptions.find((obj:any)=>obj.id===parseInt(this.packageMasterForm.value.serviceId)).type || '';
  //   let data={
  //     id:0,
  //     serviceId:this.packageMasterForm.value.serviceId,
  //     packageId:this.id,
  //     type:this.type
  //   }


  //   this.masterService.addPackageDetails(data).subscribe((result: any) => {
  //     if (result['message'] == 'Data Saved Successfully') {

  //       this.loadPackageDetails();
  //       this.packageMasterForm.patchValue({

  //         serviceId:0,

  //       })
  //     } 
  //   });

  // }
  loadPackageDetails() {
    let data = {
      "packageId": this.id
    }
    this.packageDetails$ = [];
    this.masterService.getPackageDetails(data).subscribe((res: any) => {
      this.packageDetails$ = res.data;
    })
  }
  deleteServiceDtl(id: any) {
    this.masterService.deletePackageDetails(id).subscribe((res: any) => {
      this.loadPackageDetails();
    })

  }


}
