import { Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PathologyTest } from 'app/admin/model/pathologyTest.model';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';
import { Unit } from 'app/admin/model/unit.model';
import { SharedModule } from '@shared/shared.module';
import { Direction } from '@angular/cdk/bidi';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-add-pathology-test',
  standalone: true,
  templateUrl: './add-pathology-test.component.html',
  styleUrl: './add-pathology-test.component.scss',
  imports: [
    SharedModule,
    CKEditorModule,
  ]
})
export class AddPathologyTestComponent {

  public Editor: any = ClassicEditor;
  
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  @ViewChild('parameterDetails') parameterDetails!: ElementRef<HTMLInputElement>;
  
  panleTitle: string = 'Add Pathology Test';
  pathologyTestForm: any;

  id: any;
  pathologyTest: PathologyTest = new PathologyTest();
  formdata = {
    id: null,
    name: null,
    charges: null,
    description: null
  };

  filteredOptions!: Unit[];
  options: Unit[] = [];
  constructor(private fb: UntypedFormBuilder,
    public masterService: MasterService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService,
    public dialog: MatDialog,
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.pathologyTestData) {
      this.id = urlData.pathologyTestData.id;
      this.pathologyTest = <PathologyTest>urlData.pathologyTestData;
    }
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.options.filter(o => o.name.toLowerCase().includes(filterValue));
  }

  ngOnInit(): void {
    const req = new PathologyTest();
    this.loadUnits();
    req.id = this.id;
    if (this.id) {
      this.panleTitle = 'Edit Pathology Test';
      this.loadTestDetails();
    }
    this.pathologyTestForm = this.createContactForm();
    this.setRouteDataForEdit();
  }

  loadUnits() {
    this.masterService.getUnitByCriteria({}).subscribe((data: any) => {
      this.options = data.data;
    })
  }

  testDetails$!: any;
  addDetails() {
    let data = {
      id: this.pathologyTestForm.value.id,
      name: this.pathologyTestForm.value.testName,
      unitName: this.pathologyTestForm.value.unitName,
      testType: this.pathologyTestForm.value.type,
      formula:  this.pathologyTestForm.value.formula,
      methodDesc:  this.pathologyTestForm.value.methodDesc,
      pathologyTestId: this.id
    }

    this.masterService.addPathologyTestDetails(data).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.loadTestDetails();
        this.pathologyTestForm.patchValue({
          id: 0,
          testName: '',
          unitName: '',
          testType: '',
          formula: '',
          methodDesc:'',
        })
      }
    });
  }

  editTestDetails(details: any){
    this.pathologyTestForm.patchValue({
      id: details.id,
      testName: details.name,
      unitName: details.unitName,
      type: details.testType,
      formula: details.formula,
      methodDesc: details.methodDesc,
      pathologyTestId: details.pathologyTestId
    });
    this.parameterDetails.nativeElement.scrollIntoView({ behavior: 'smooth'});;
  }

  loadTestDetails() {
    let data = {
      "pathologyTestId": this.id
    }
    this.testDetails$ = [];
    this.masterService.getPathologyTestDetails(data).subscribe((res: any) => {
      this.testDetails$ = res.data;
    })
  }

  deletePathologyTestDtl(id: any) {
    this.masterService.deletePathologyTestDetails(id).subscribe((res: any) => {
      this.loadTestDetails();
    })
  }

  addNew(id: any,testDetail:any) {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: {
       action: 'add',
       testDetail:testDetail
      },
      direction: tempDirection,
      height: '100%',
      width: '100%',
       maxWidth: "100%",
      maxHeight: "100%"
    });
  }

  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this._snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

  setRouteDataForEdit() {
    this.pathologyTestForm.patchValue({
      id: this.pathologyTest?.id,
      name: this.pathologyTest?.name,
      charges: this.pathologyTest?.charges,
      description: this.pathologyTest?.description
    });
  }

  onSubmit() {
    let data = {
      id: this.id,
      name: this.pathologyTestForm.value.name,
      charges: this.pathologyTestForm.value.charges,
      description: this.pathologyTestForm.value.description,
      type: 'T'
    }
    this.masterService.addPathologyTest(data).subscribe((result: any) => {
      if(this.id){
        this.router.navigate(['/admin/master/pathology-test-list']);
      }else{
        this.router.navigateByUrl('/admin/master/add-pathology-test', {state: {pathologyTestData: result.data}});
      }
      this.id = result.data.id;
      this.openSnackBar(result['message']);
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
      ],
      description: [''],
      testName: [''],
      unitName: [''],
      type: ['F'],
      formula: [''],
      methodDesc: [''],
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
