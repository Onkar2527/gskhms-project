import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators, UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { MasterService } from 'app/admin/service/master.service';

export interface DialogData {
  id: number;
  action: string;
  testDetail:any;
}
@Component({
    selector: 'app-form-dialog:not(a)',
    templateUrl: './form-dialog.component.html',
    styleUrls: ['./form-dialog.component.scss'],
    standalone: true,
    imports: [
       SharedModule
    ],
})
export class FormDialogComponent {
  action: string;
  id: number;
  detailId: number=0;
  dialogTitle: string;
  testDetail:any;
  ambulanceCallListForm: UntypedFormGroup;
  pathologyTestForm: UntypedFormGroup;
  @ViewChild('ageTestForm') ageTestForm!: ElementRef<HTMLInputElement>;
  
  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,public masterService: MasterService,
    
    private fb: UntypedFormBuilder
  ) {
    // Set the defaults
    this.action = data.action;
    this.testDetail=data.testDetail;
    this.id=data.testDetail.id;
    this.dialogTitle = 'Test Parameter';            
    
    this.ambulanceCallListForm = this.createContactForm();
    this.pathologyTestForm=this.createPathologyForm();
    this.loadTestRangeDetails();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  testDetails$!: any;
  createPathologyForm(): UntypedFormGroup {
    return this.fb.group({
      ageMin:[0],
      ageMax:[0],
      normalMin:[0],
      normalMax:[0],
      maleNormalRangeMin:[0],
      maleNormalRangeMax:[0],
      femaleNormalRangeMin:[0],
      femaleNormalRangeMax:[0],
      descriptiveRangeM: [''],
      descriptiveRangeF: [''],
    });
  }

  addDetails() {
    let data = {
      id: this.detailId,
      ageMin: this.pathologyTestForm.value.ageMin,
      ageMax: this.pathologyTestForm.value.ageMax,
      normalMin: this.pathologyTestForm.value.normalMin,
      normalMax: this.pathologyTestForm.value.normalMax,
      maleNormalRangeMin: this.pathologyTestForm.value.maleNormalRangeMin,
      maleNormalRangeMax: this.pathologyTestForm.value.maleNormalRangeMax,
      femaleNormalRangeMin: this.pathologyTestForm.value.femaleNormalRangeMin,
      femaleNormalRangeMax: this.pathologyTestForm.value.femaleNormalRangeMax,
      descriptiveRangeM: this.pathologyTestForm.value.descriptiveRangeM,
      descriptiveRangeF: this.pathologyTestForm.value.descriptiveRangeF,
      pathalogyTestDtlId: this.id,
    }

    this.masterService.addPathologyTestRangeDetails(data).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.loadTestRangeDetails();
        this.detailId=0;
        this.pathologyTestForm.patchValue({
          ageMin: 0,
          ageMax: 0,
          normalMin: 0,
          normalMax: 0,
          maleNormalRangeMin: 0,
          maleNormalRangeMax: 0,
          femaleNormalRangeMin: 0,
          femaleNormalRangeMax: 0,
          descriptiveRangeM: '',
          descriptiveRangeF: ''
        })
      }
    });
  }

  editRow(detail:any){
    this.detailId=detail.id;
    this.pathologyTestForm.patchValue({
      ageMin: detail.ageMin,
      ageMax: detail.ageMax,
      normalMin: detail.normalMin,
      normalMax: detail.normalMax,
      maleNormalRangeMin: detail.maleNormalRangeMin,
      maleNormalRangeMax: detail.maleNormalRangeMax,
      femaleNormalRangeMin: detail.femaleNormalRangeMin,
      femaleNormalRangeMax: detail.femaleNormalRangeMax,
      descriptiveRangeM: detail.descriptiveRangeM,
      descriptiveRangeF: detail.descriptiveRangeF
    });
    this.ageTestForm.nativeElement.scrollIntoView({ behavior: 'smooth'});;
  }

  loadTestRangeDetails() {
    let data = {
      "pathalogyTestDtlId": this.id
    }
    this.testDetails$ = [];
    this.masterService.getPathologyTestRangeDetails(data).subscribe((res: any) => {
      this.testDetails$ = res.data;
    })
  }
  
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      m_n_r_l: [this.testDetail.maleNormalRangeMin],
      m_n_r_u: [this.testDetail.maleNormalRangeMax],
      f_n_r_l: [this.testDetail.femaleNormalRangeMin],
      f_n_r_u: [this.testDetail.femaleNormalRangeMax],
      descriptiveRangeM: [this.testDetail.descriptiveRangeM],
      descriptiveRangeF: [this.testDetail.descriptiveRangeF],
    });
  }

  submit() {
    // emppty stuff
  }

  saveDetails(){
    this.testDetail.maleNormalRangeMin=this.ambulanceCallListForm.value.m_n_r_l,
    this.testDetail.maleNormalRangeMax=this.ambulanceCallListForm.value.m_n_r_u,
    this.testDetail.femaleNormalRangeMin=this.ambulanceCallListForm.value.f_n_r_l,
    this.testDetail.femaleNormalRangeMax=this.ambulanceCallListForm.value.f_n_r_u,
    this.testDetail.descriptiveRangeM=this.ambulanceCallListForm.value.descriptiveRangeM,
    this.testDetail.descriptiveRangeF=this.ambulanceCallListForm.value.descriptiveRangeF,
    this.masterService.addPathologyTestDetails(this.testDetail).subscribe((result: any) => {
      this.dialogRef.close();
    });
  }

  deleteAgeBasedRanges(id: number){
    this.masterService.deleteAgeBasedRanges(id).subscribe((result: any) => {
      this.loadTestRangeDetails();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {}
}
