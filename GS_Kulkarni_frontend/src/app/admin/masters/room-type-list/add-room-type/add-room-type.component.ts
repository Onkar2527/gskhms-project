import { CommonModule, NgFor } from '@angular/common';
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
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { SharedModule } from '@shared/shared.module';
import { RoomType } from 'app/admin/model/room-type.model';

import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';

@Component({
  selector: 'app-add-room-type',
  standalone: true,
  templateUrl: './add-room-type.component.html',
  styleUrl: './add-room-type.component.scss',
  imports: [
    SharedModule
  ]
})
export class AddRoomTypeComponent {
  billingClassOptions: any[] = [];
  panleTitle: string = 'Add Room Type';
  roomTypeForm: any;
  id: any;
  roomType: RoomType = new RoomType();
  formdata = {
    id: null,
    name: null,
    billingClassId:null
  };
  constructor(private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    public masterService: MasterService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.roomTypeData) {
      this.id = urlData.roomTypeData.id;
      this.roomType = <RoomType>urlData.roomTypeData;
      
    }
  }
  loadBillingClass()
  {
    this.masterService.getBillingClass({}).subscribe((data:any)=>{
      this.billingClassOptions=data.data;

    })
  }

  ngOnInit(): void {
    const req = new RoomType();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Room Type';
    }
    this.loadBillingClass();
    this.roomTypeForm = this.createContactForm();
    this.setRouteDataForEdit();
    
    
  }

  setRouteDataForEdit() {
    this.roomTypeForm.patchValue({
      id:this.roomType?.id,
      name:this.roomType?.name,
      billingClassId:this.roomType?.billingClassId
    });
  }

  onSubmit() {
    this.masterService.addRoomType(this.roomTypeForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/room-type-list']);
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
      billingClassId: [
        this.formdata.billingClassId,
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
