
import { NgFor } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogClose
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Services } from 'app/admin/model/services.model';
import { ServicesService } from 'app/admin/service/services.service';
import { DepartmentList } from 'app/admin/departments/department-list/department-list.model';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';
import { DialogData } from '../../today-appointment.component';
import { PackageMaster } from 'app/admin/model/packageMaster.model';
import { Router } from '@angular/router';
import { Unit } from 'chart.js/dist/scales/scale.time';
import { Appointments } from 'app/doctor/opd/appointments/appointments.model';
import { AppointmentsService } from 'app/doctor/opd/appointments/appointments.service';
import { PaymentsService } from 'app/accountant/payments.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-form-dialog:not(p)',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.scss'],
  standalone: true,
  imports: [
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


export class FormDialogComponent implements OnInit {
  action: string;
  dialogTitle: string;
  listForm: UntypedFormGroup;
  servicesList: Services;
  departments$: any;
  services$: any;
  packageDetails$: any = [];
  selectedServiceIds: number[] = [];
  hospitalId: any;
  id: any;
   appointment!: Appointments;
  @Input() appoinment_id:any;


  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public servicesService: ServicesService,
    public appointmentsService: AppointmentsService,
    private fb: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    public dropdownService: DropdownService,
    public masterService: MasterService,
    public paymentService: PaymentsService,
  ) {
    this.action = data.action;
    this.id = data.id || 0; // assign packageId if sent in dialog data
    this.appoinment_id = data.appointment_id || 0; // assign appointmentId if sent in dialog data

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Services';
      this.servicesList = data.servicesList;
    } else {
      this.dialogTitle = 'Add Services';
      this.servicesList = new Services();
    }

    this.listForm = this.fb.group({
      serviceId: [[]],
      name: [this.servicesList.name,],
      deptId: [this.servicesList.deptId],
      paymentStatus: ['UNPAID'],
      appoinment_id: this.appoinment_id,
      hospital_id:1,
      finalBillingId: [''], // ensure this is present
      document_no: [''], // ensure this is present
      description: [''],
      // amount: [this.servicesList.amount],
    });
  }

  ngOnInit(): void {
    this.getDepartments();
    this.getServices();
    this.loadPackageDetails();
  }

  getDepartments(): void {
    const data = new DepartmentList();
    data.status = 'Active';
    this.dropdownService.departmentCombo(data).subscribe((result: any) => {
      this.departments$ = result.data;
    });
  }

  getServices(): void {
    const data = new Services();
    data.hospitalId = this.hospitalId;
    this.dropdownService.servicesCombo(data).subscribe((result: any) => {
      this.services$ = result.data;
    });
  }

  getServiceName(id: number): string {
    const service = this.services$?.find((s: any) => s.id === id);
    return service ? service.name : '';
  }

  getTotalCharges(): number {
    return this.packageDetails$?.reduce((acc: number, item: any) => acc + (item.charges || 0), 0) || 0;
  }

  loadPackageDetails(): void {
    const data = {  "appointmentId": this.appoinment_id, "packageId": this.id};
    console.log('Loading package details with data:', data);
    this.masterService.getAppoinmentServiceDetails(data).subscribe((res: any) => {
      this.packageDetails$ = res.data || [];
    });
  }

  deleteServiceDtl(id: number): void {
    this.masterService.deletePackageDetails(id).subscribe(() => {
      this.loadPackageDetails();
    });
  }

  addPackageDetails(): void {
    const selectedServiceIds = this.listForm.value.serviceId;

    if (!selectedServiceIds || selectedServiceIds.length === 0) return;

    const existingServiceIds = this.packageDetails$.map((item: any) => item.serviceId);
    const newServices = selectedServiceIds.filter((id: number) => !existingServiceIds.includes(id));

    const dataArray = newServices.map((serviceId: number) => {
      const service = this.services$?.find((s: any) => s.id === serviceId);
      return {
        id: 0,
        serviceId,
        appointmentId: this.appoinment_id,
        packageId: this.id,
        type: service?.type || '',
        charges: service?.rate || 0
      };
    });

    dataArray.forEach((data: { id: number; appointmentId: any; serviceId: number; packageId: number; type: string; charges: number }) => {
      this.masterService.addAppoinmentServiceDetails(data).subscribe((result: any) => {
        if (result?.message === 'Data Saved Successfully') {
          this.loadPackageDetails();
          this.openSnackBar('Service added successfully!');
        }
      });
    });

    this.listForm.patchValue({ serviceId: [] });
  }

  confirmAdd(): void {
    if (this.action === 'edit') {
      this.servicesService.updateServices(this.listForm.getRawValue());
    } else {
      this.servicesService.addServices(this.listForm.getRawValue());
    }
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    window.history.back();
  }
    submit() {
    // emppty stuff
  }



  // save() {
  //   // if (!this.listForm.valid) {
  //   //   this.openSnackBar('Please fill all required fields');
  //   //   return;
  //   // }

  //   console.log("payload", this.listForm.value);
  
  //   const payload = this.listForm.value;

  //   // if (!this.listForm.valid) {
  //   //   this.openSnackBar('Please fill all required fields');
  //   //   return;
  //   // }
  
  //   this.paymentService.makePayment(payload).pipe(
  //     catchError(() => {
  //       this.openSnackBar('Error occurred while saving');
  //       return of(null); // Fix: use of(null)
  //     })
  //   ).subscribe((result: any) => {
  //     if (result) {
  //       this.openSnackBar(result['message'] || 'Saved successfully');
  //       this.dialogRef.close(); // Optional, if it's in a dialog
  //     }
  //   });
  // }

  // save() {

    
  // const payload = { ...this.listForm.value };
  // // delete payload.serviceId; // Remove empty serviceId field

  // const totalAmount = this.getTotalCharges();
  // payload.amount = totalAmount;

  // console.log("payload", payload);
  // this.appointmentsService.updateAppointmentsPayment(payload).subscribe((result: any) => {
  //   if (result['message'] == 'Data Modified Successfully') {
  //     this.openSnackBar(result['message']);
  //     history.back();
  //   } else {
  //     this.openSnackBar(result['message']);
  //   }
  // });



  //   // console.log("payload", this.listForm.value);
  //   // this.appointmentsService.updateAppointments(this.listForm.value).subscribe((result: any) => {
  //   //   if (result['message'] == 'Data Modified Successfully') {
  //   //     this.openSnackBar(result['message']);
  //   //     history.back();
  //   //   } else {
  //   //     this.openSnackBar(result['message']);
  //   //   }
  //   // })
  // }

//   save() {
//   const payload = { ...this.listForm.value };
//   const totalAmount = this.getTotalCharges();

//   // Get service names
//   const serviceNames = this.packageDetails$
//   .map((detail: { id: number; serviceId: number; appointmentId: any; packageId: number; type: string; charges: number }) => 
//     this.getServiceName(detail.serviceId))
//   .join(', ');

//   payload.amount = totalAmount;
//   payload.serviceNames = serviceNames; // Add service names to the payload

//   console.log("payload", payload);
//   this.appointmentsService.updateAppointmentsPayment(payload).subscribe((result: any) => {
//     if (result['message'] == 'Data Modified Successfully') {
//       this.openSnackBar(result['message']);
//       history.back();
//     } else {
//       this.openSnackBar(result['message']);
//     }
//   });
// }


save() {
  const payload = { ...this.listForm.value };
  const totalAmount = this.getTotalCharges();

  // Get service names
  const serviceNames = this.packageDetails$
    .map((detail: { id: number; serviceId: number; appointmentId: any; packageId: number; type: string; charges: number }) => 
      this.getServiceName(detail.serviceId))
    .join(', ');

  payload.amount = totalAmount;
  payload.serviceNames = serviceNames; // Add service names to the payload

  console.log("payload", payload);
  this.appointmentsService.updateAppointmentsPayment(payload).subscribe((result: any) => {
    if (result['message'] == 'Data Modified Successfully') {
      this.openSnackBar(result['message']);

      // ✅ Clear the services table data
      this.packageDetails$ = [];

      history.back();
    } else {
      this.openSnackBar(result['message']);
    }
  });
}



  


  
  
  



}

