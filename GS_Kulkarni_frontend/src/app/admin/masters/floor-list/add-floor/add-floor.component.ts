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
import { Floor } from 'app/admin/model/floor.model';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';

@Component({
  selector: 'app-add-floor',
  standalone: true,
  templateUrl: './add-floor.component.html',
  styleUrl: './add-floor.component.scss',
  imports: [
    SharedModule
  ]
})
export class AddFloorComponent {
  panleTitle: string = 'Add Floor';
  floorForm: any;
  id: any;
  floor: Floor = new Floor();
  formdata = {
    id: null,
    name: null
  };
  constructor(private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    public masterService: MasterService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.floorData) {
      this.id = urlData.floorData.id;
      this.floor = <Floor>urlData.floorData;
      
    }
  }

  ngOnInit(): void {
    const req = new Floor();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Floor';
    }
    this.floorForm = this.createContactForm();
    this.setRouteDataForEdit();
    
  }

  setRouteDataForEdit() {
    
    this.floorForm.patchValue({
      id:this.floor?.id,
      name:this.floor?.name
    });
  }

  onSubmit() {
    this.masterService.addFloor(this.floorForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/floor-list']);
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
