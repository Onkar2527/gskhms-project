import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';

import { Unit } from '../model/unit.model';
import { PathologyTest } from '../model/pathologyTest.model';
import { PackageMaster } from '../model/packageMaster.model';
import { NoteTemplate } from '../model/noteTemplate.model';
import { BillingClass } from '../model/billing-class.model';
import { RoomType } from '../model/room-type.model';
import { Bed } from '../model/bed.model';
import { Room } from '../model/room.model';
import { Role } from '@core/models/role';
import { GNoteTemplate } from '../model/gnoteTemplate.model';

@Injectable({
  providedIn: 'root',
})

export class MasterService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: any;
  apiBaseUrl: string = "";
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): any[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getUnitList(unit: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'units/search',unit).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  getFloorList(unit: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'floor/search',unit).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  getRoomTypeList(unit: any): void {
    const req = new Unit();
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'room-type/search',unit).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  getBillingClassList(unit: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'billing-class/search',unit).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  getBedList(unit: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'bed/search',unit).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  getRoomList(unit: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'room/search',unit).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  getTemplateList(unit: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'template/search',unit).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  getGTemplateList(unit: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'Gtemplate/search',unit).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  getOperationTypeList(unit: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'operation-type/search',unit).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  getAnesthesiaTypeList(unit: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'anesthesia-type/search',unit).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }


  getUnitById(id: number) {
    return this.httpClient.get(this.apiBaseUrl + 'units/search/' + id);
  }
  getUnitByCriteria(unit: any) {
    return this.httpClient.post(this.apiBaseUrl + 'units/search', unit);
  }

  getBillingClass(unit: any) {
    return this.httpClient.post(this.apiBaseUrl + 'billing-class/search', unit);
  }
  
  getRoom(unit: any) {
    return this.httpClient.post(this.apiBaseUrl + 'room/search', unit);
  }

  getRoomType(unit: any) {
    return this.httpClient.post(this.apiBaseUrl + 'room-type/search', unit);
  }

  getFloor(unit: any) {
    return this.httpClient.post(this.apiBaseUrl + 'floor/search', unit);
  }

  getBeds(unit: any) {
    return this.httpClient.post(this.apiBaseUrl + 'bed/search', unit);
  }

  getMedicineByCriteria() {
    return this.httpClient.get(this.apiBaseUrl + 'pharmacy/search');
  }

  getPathologyTesByCriteria(unit: any) {
    return this.httpClient.post(this.apiBaseUrl + 'pathologytests/search', unit);
  }
  addUnit(unit: Unit) {
    return this.httpClient.post(this.apiBaseUrl + 'units/save', unit);
  }
  
  addBed(unit: Bed) {
    return this.httpClient.post(this.apiBaseUrl + 'bed/save', unit);
  }
  
  updateBed(unit: Bed) {
    return this.httpClient.put(this.apiBaseUrl + 'bed/update', unit);
  }

  releaseBed(unit: Bed) {
    return this.httpClient.get(this.apiBaseUrl + 'appointmentbedassign/release/'+unit.id);
  }

  getAppointmentByBed(unit: any) {
    return this.httpClient.post(this.apiBaseUrl + 'appointmentbedassign/search', unit);
  }

  getInfra(forDoctors: boolean = false) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    if (currentUser.role === Role.Doctor && forDoctors) {
      return this.httpClient.get(this.apiBaseUrl + 'hospital-infra/'+currentUser.id);
    } else {
      return this.httpClient.get(this.apiBaseUrl + 'hospital-infra');
    }
  }

  addRoom(unit: Room) {
    return this.httpClient.post(this.apiBaseUrl + 'room/save', unit);
  }
  addRoomType(unit: RoomType) {
    return this.httpClient.post(this.apiBaseUrl + 'room-type/save', unit);
  }
  addBillingClass(billingClass: BillingClass) {
    return this.httpClient.post(this.apiBaseUrl + 'billing-class/save', billingClass);
  }
  addFloor(unit: Unit) {
    return this.httpClient.post(this.apiBaseUrl + 'floor/save', unit);
  }
  addTemplate(template: any) {
    return this.httpClient.post(this.apiBaseUrl + 'template/save', template);
  }
  addoperationType(template: any) {
    return this.httpClient.post(this.apiBaseUrl + 'operation-type/save', template);
  }
  addAnesthesiaType(template: any) {
    return this.httpClient.post(this.apiBaseUrl + 'anesthesia-type/save', template);
  }
  
  getAllTemplate(template: any) {
    return this.httpClient.post(this.apiBaseUrl + 'template/search', template);
  }

  getAllServices(type: any) {
    return this.httpClient.get(this.apiBaseUrl + 'services/getall/'+type);
  }
  
  updateUnit(unit: Unit) {
    return this.httpClient.put(this.apiBaseUrl + 'units/update', unit);
  }

  
  getPathologyTestList(pathologyTest: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pathologytests/search',pathologyTest).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }



  addPathologyTest(pathologyTest: PathologyTest) {
    return this.httpClient.post(this.apiBaseUrl + 'pathologytests/save', pathologyTest);
  }
  
  addNoteTemplateTest(noteTemplate: NoteTemplate) {
    return this.httpClient.post(this.apiBaseUrl + 'notetemplate/save', noteTemplate);
  }
   addGNoteTemplateTest(gnoteTemplate: GNoteTemplate) {
    return this.httpClient.post(this.apiBaseUrl + 'Gtemplate/save', gnoteTemplate);
  }
 getProcedureById(id: any) {
  return this.httpClient.get(this.apiBaseUrl + 'Gtemplate/findById', {
    params: { id }
  });
}

  addPathologyTestRangeDetails(pathologyTestDtl: any) {
    return this.httpClient.post(this.apiBaseUrl + 'pathologytestagerange/save', pathologyTestDtl);
  }

  deleteAgeBasedRanges(id: any) {
    return this.httpClient.delete(this.apiBaseUrl + 'pathologytestagerange/'+id);
  }
  
  addPathologyTestDetails(pathologyTestDtl: any) {
    return this.httpClient.post(this.apiBaseUrl + 'pathologytestdetails/save', pathologyTestDtl);
  }

  addTemplateDetails(template: any) {
    return this.httpClient.post(this.apiBaseUrl + 'templatedetails/save', template);
  }

  addPrescriptionDetails(template: any) {
    return this.httpClient.post(this.apiBaseUrl + 'prescription/save', template);
  }

  savePrescriptionDetails(prescriptionDetails: any[]) {
    return this.httpClient.post(this.apiBaseUrl + 'prescription/save-all', prescriptionDetails);
  }

 savePrescriptionDetailsAfter(prescriptionDetails: any[]) {
    return this.httpClient.post(this.apiBaseUrl + 'prescriptionAfter/save-all', prescriptionDetails);
  }
  addAppoinmentServiceDetails(template: any) {
    return this.httpClient.post(this.apiBaseUrl + 'appointmentservice/save', template);
  }

  getAppoinmentServiceDetails(template: any) {
    return this.httpClient.post(this.apiBaseUrl + 'appointmentservice/search', template);
  }
  
  deleteAppoinmentServiceDetails(id: any) {
    return this.httpClient.delete(this.apiBaseUrl + 'appointmentservices/'+id);
  }
  
  deletePrescriptionDetails(id: any) {
    return this.httpClient.delete(this.apiBaseUrl + 'prescription/'+id);
  }
  
  getPrescriptionDetails(templateDet: any) {
    return this.httpClient.post(this.apiBaseUrl + 'prescription/search', templateDet);
  }
  getPrescriptionDetailsAfter(templateDet: any) {
    return this.httpClient.post(this.apiBaseUrl + 'prescriptionAfter/search', templateDet);
  }
  
  addPackageDetails(packageDetails: any) {
    return this.httpClient.post(this.apiBaseUrl + 'packagemasterdetails/save', packageDetails);
  }
  
  getPathologyTestDetails(pathologyTestDtl: any) {
    return this.httpClient.post(this.apiBaseUrl + 'pathologytestdetails/search', pathologyTestDtl);
  }
  
  getPathologyTestRangeDetails(pathologyTestDtl: any) {
    return this.httpClient.post(this.apiBaseUrl + 'pathologytestagerange/search', pathologyTestDtl);
  }

  getTemplateDetails(templateDet: any) {
    return this.httpClient.post(this.apiBaseUrl + 'templatedetails/search', templateDet);
  }
  
  getPackageDetails(packageDetails: any) {
    return this.httpClient.post(this.apiBaseUrl + 'packagemasterdetails/search', packageDetails);
  }
  
  deletePackageDetails(id: any) {
    return this.httpClient.delete(this.apiBaseUrl + 'packagemasterdetails/'+id);
  }

  deletePathologyTestDetails(id: any) {
    return this.httpClient.delete(this.apiBaseUrl + 'pathologytestdetails/'+id);
  }
  
  deleteTemplateDetails(id: any) {
    return this.httpClient.delete(this.apiBaseUrl + 'templatedetails/'+id);
  }
  
  updatePathologyTest(pathologyTest: PathologyTest) {
    return this.httpClient.put(this.apiBaseUrl + 'pathologytests/update', pathologyTest);
  }
  
  getPackageMasterList(packageMaster: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'packagemaster/search',packageMaster).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
  
  addPackageMaster(packageMaster: PackageMaster) {
    return this.httpClient.post(this.apiBaseUrl + 'packagemaster/save', packageMaster);
  }
  
  getNoteTemplateList(noteTemplate: any): void {
    const req = new Unit();
    // this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'pharmacy/search', req).subscribe({
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'notetemplate/search',noteTemplate).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data.data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }
}
