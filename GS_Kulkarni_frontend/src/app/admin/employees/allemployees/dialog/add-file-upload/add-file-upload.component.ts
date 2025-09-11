import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators, FormsModule, ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Employee } from 'app/admin/employees/allemployees/employees.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { BehaviorSubject, Observable, catchError, fromEvent, map, merge } from 'rxjs';
import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@config';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { DropdownService } from 'app/admin/service/dropdown.service';
import { AddFileUpload } from 'app/admin/model/addFileUpload.model';
import { AddFileUploadService } from 'app/admin/service/addfileupload.service';
import { Router } from '@angular/router';

export interface DialogData {
  id: number;
  action: string;
  employee: Employee;
}

@Component({
  selector: 'app-add-file-upload',
  standalone: true,
  templateUrl: './add-file-upload.component.html',
  styleUrl: './add-file-upload.component.scss',
  imports: [
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    NgFor,
    MatCheckboxModule,
    CommonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogClose,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FeatherIconsComponent,
    MatRippleModule,
    MatProgressSpinnerModule,
    DatePipe,
    BreadcrumbComponent,
    FileUploadComponent,
    MatInputModule,
  ],
})

export class AddFileUploadComponent extends UnsubscribeOnDestroyAdapter
implements OnInit{

  @ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

  addFileUploadForm: any;
  action: string;
  dialogTitle: string;
  displayedColumns = [
    'docType',
    'docName',
    'docNumber',
    'actions',
  ];
  formdata = {
    docName: '',
    docNumber: '',
  };

  exampleDatabase?:  AddFileUploadService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel< AddFileUpload>(true, []);
  index?: number;
  employee: Employee;
  // addAddFileUpload = false;
  isTblLoading = false;
  todaysDate = new Date();
  errorMsg = '';
  successMsg = '';
  uploadDocumentsList = false;
  router: any;
  private _snackBar: any;

  constructor(private fb: UntypedFormBuilder,
    public dialogRef: MatDialogRef<AddFileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public httpClient: HttpClient,
    public  addFileUploadService:  AddFileUploadService,
    public config: ConfigService,
    public dropDownService: DropdownService,
  ) {
    super();
    // Set the defaults
    this.action = data.action;
    this.dialogTitle = 'Upload Documents List';
    this.employee = data.employee;
  }
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild('filter', { static: true }) filter!: ElementRef;
  
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  
  ngOnInit() {
    this.isTblLoading = true;
    this.loadData(); 
    this.isTblLoading = false;
    this.addFileUploadForm = this.createForm();
  }

  addNew(){
    this.uploadDocumentsList = true;
  }

  // onSubmit() {
  //   console.log('Form Value', this.addFileUploadForm.value);
  //   this.addFileUploadService.addAddFileUpload(this.addFileUploadForm.value).subscribe((result: any) => {
  //     if (result['message']) {
  //       this.openSnackBar(result['message']);
  //       this.router.navigate(['admin/employees/allemployee/dialog/add-file-upload']);
  //     }
  //     else {
  //       this.openSnackBar(result['message']);

  //     }
  //   })
  // }

  onSubmit() {
    // if(this.addFileUploadForm.valid){
    //   if(this.userId == -1){
    //     const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    //     this.addFileUploadForm.hospitalId = currentUser.hospitalId;
    //     this.addFileUploadForm.id = null;
    //     let formData = new FormData();
    //     if(this.fileUploadComponent){
    //       formData.append('file', this.fileUploadComponent.file);
    //     }
    //     formData.append('user', JSON.stringify(this.addFileUploadForm.value));
    //     this.addFileUploadForm.addEmployeeData(formData).pipe(
    //       catchError(() => {
    //         this.openSnackBar('Error occurred to add');
    //         return '';
    //       })
    //     ).subscribe((result: any) => {
    //       if (result['message'] == 'Data Saved Successfully') {
    //         this.openSnackBar(result['message']);
    //         this.router.navigate(['/admin/employees/all-employees']);
    //       } 
    //     })
    //   }
    // }
  }
   
  cancel() {
    window.history.back();
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      docName:[this.formdata.docName, [Validators.required]],
      docNumber: [
        this.formdata.docNumber,
      ],
    });
  }

  refresh() {
    this.isTblLoading = true;
    this.loadData();
    this.isTblLoading = false;
    this.successMsg = '';
    this.errorMsg = '';
  }
   
  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  addAddFileUpload(row: AddFileUpload) {
    this.addFileUploadService.addAddFileUpload(row).pipe(
      catchError(() => {
        this.errorMsg = 'Error occurred to add';
        this.successMsg = '';
        return '';
      })
    )
    .subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.successMsg = result['message'];
        this.errorMsg = '';
      } 
    })
  }

  public loadData() {
    this.exampleDatabase = new AddFileUploadService(this.httpClient, this.config);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.employee
    );
    if(this.filter){
      this.subs.sink = fromEvent(this.filter.nativeElement, 'keyup').subscribe(
        () => {
          if (!this.dataSource) {
            return;
          }
          this.dataSource.filter = this.filter.nativeElement.value;
        }
      );
    }
  }
}

export class ExampleDataSource extends DataSource< AddFileUpload> {
  filterChange = new BehaviorSubject('');
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData:  AddFileUpload[] = [];
  renderedData:  AddFileUpload[] = [];
  constructor(
    public exampleDatabase:  AddFileUploadService,
    public employee : Employee
  ) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable< AddFileUpload[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this.filterChange,
    ];
    this.exampleDatabase.getfiles(this.employee.employeeId, 'user');
    return merge(...displayDataChanges).pipe(
      map(() => {
        this.filteredData = this.exampleDatabase.data
        .slice()
        .filter((addFileUpload: AddFileUpload) => {
          const searchStr = (
            addFileUpload.docType +
            addFileUpload.docTypeId +
            addFileUpload.name +
            addFileUpload.docNumber +
            addFileUpload.hospitalId +
            addFileUpload.docPath +
            addFileUpload.verifyStatus +
            addFileUpload.verifyRemark 
          ).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
        this.renderedData = this.filteredData;
        return this.renderedData;
      })
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect() { }
}
