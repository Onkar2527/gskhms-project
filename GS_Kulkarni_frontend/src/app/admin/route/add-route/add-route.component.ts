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
import { Pharmacy } from 'app/admin/model/pharmacy.model';
import { PharmacyService } from 'app/admin/service/pharmacy.service';
import { RouteService } from 'app/admin/service/route.service';
import { Route } from 'app/admin/model/route.model';

@Component({
  selector: 'app-add-route',
  standalone: true,
  templateUrl: './add-route.component.html',
  styleUrl: './add-route.component.scss',
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
export class AddRouteComponent {
  panleTitle: string = 'Add Route';
  routeForm: any;
  id: any;
  route: Route = new Route();
  formdata = {
    id: null,
    name: null
  };
  constructor(private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    public routeService: RouteService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.routeData) {
      this.id = urlData.routeData.id;
      this.route = <Route>urlData.routeData;
    }
  }

  ngOnInit(): void {
    const req = new Route();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Route';
    }
    this.routeForm = this.createContactForm();
    this.setRouteDataForEdit();
    
  }

  setRouteDataForEdit() {
    this.routeForm.patchValue({
      id:this.route?.id,
      name:this.route?.name
    });
  }

  onSubmit() {
    this.routeService.addRoute(this.routeForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/route/route-list']);
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
