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
import { Bed } from 'app/admin/model/bed.model';


import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';

@Component({
  selector: 'app-add-bed',
  standalone: true,
  templateUrl: './add-bed.component.html',
  styleUrl: './add-bed.component.scss',
  imports: [
    SharedModule
  ]
})
export class AddBedComponent {
  roomOptions: any[] = [];
  panleTitle: string = 'Add Bed';
  bedForm: any;
  id: any;
  bed: Bed = new Bed();
  formdata = {
    id: null,
    name: null,
    roomId:null
  };
  constructor(private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    public masterService: MasterService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.bedData) {
      this.id = urlData.bedData.id;
      this.bed = <Bed>urlData.bedData;
      
    }
  }
  loadRoom()
  {
    this.masterService.getRoom({}).subscribe((data:any)=>{
      this.roomOptions=data.data;

    })
  }

  ngOnInit(): void {
    const req = new Bed();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Bed';
    }
    this.loadRoom();
    this.bedForm = this.createContactForm();
    this.setRouteDataForEdit();
    
    
  }

  setRouteDataForEdit() {
    this.bedForm.patchValue({
      id:this.bed?.id,
      name:this.bed?.name,
      roomId:this.bed?.roomId
    });
  }

  onSubmit() {
    this.masterService.addBed(this.bedForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/bed-list']);
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
      roomId: [
        this.formdata.roomId,
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
