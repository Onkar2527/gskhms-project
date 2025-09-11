import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { ConfigService } from '../../config';
import { RateTye } from '../model/rateType.model';
import { Occupation } from '../model/occupation.model';
import { Specialization } from '../model/specialization.model';
import { Designation } from '../model/designation.model';
import { DepartmentList } from '../departments/department-list/department-list.model';
import { PatientsCategory } from '../model/patientscategory.model';
import { Employee } from '../employees/allemployees/employees.model';
import { ServiceGroup } from '../model/servicegroup.model';
import { SubDepartmet } from '../model/subdepartments.model';
import { Role } from '../model/role.model';
import { Section } from '../model/section.model';
import { Hospital } from '../model/hospital.model';
import { Services } from '../model/services.model';
import { GNoteTemplate } from '../model/gnoteTemplate.model';


@Injectable({
  providedIn: 'root',
})
export class DropdownService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/employee.json';
  apiBaseUrl: string = "";
  isTblLoading = true;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }

  departmentCombo(data:DepartmentList) {
    return this.httpClient.post(this.apiBaseUrl + 'dept/search', data);
  }

  operationCombo(data:GNoteTemplate) {
    return this.httpClient.post(this.apiBaseUrl + 'Gtemplate/search', data);
  }

  designationCombo(data:Designation) {
    return this.httpClient.post(this.apiBaseUrl + 'designation/search', data);
  }

  specializationCombo(data:Specialization) {
    return this.httpClient.post(this.apiBaseUrl + 'specialization/search', data);
  }

  occupationCombo(data:Occupation) {
    return this.httpClient.post(this.apiBaseUrl + 'occupation/search', data);
  }

  rateTypeCombo(data:RateTye) {
    return this.httpClient.post(this.apiBaseUrl + 'rateType/search', data);
  }
  
  categoryCombo(data:PatientsCategory) {
    return this.httpClient.post(this.apiBaseUrl + 'patCategory/search', data);
  }
  
  userCombo(data: Employee){
    return this.httpClient.post(this.apiBaseUrl + 'user/search', data);
  }
  
  serviceGroupCombo(data: ServiceGroup){
    return this.httpClient.post(this.apiBaseUrl + 'servicegroup/search', data);
  }

  subDepartmentCombo(data: SubDepartmet){
    return this.httpClient.post(this.apiBaseUrl + 'dept/subdept/search', data);
  }

  roleCombo(data: Role){
    return this.httpClient.post(this.apiBaseUrl + 'role/search', data);
  }
  
  sectionCombo(data: Section){
    return this.httpClient.post(this.apiBaseUrl + 'section/search', data);
  }
  
  hospitalCombo(data: Hospital){
    return this.httpClient.post(this.apiBaseUrl + 'hospital/search', data);
  }

  servicesCombo(data: Services){
    return this.httpClient.post(this.apiBaseUrl + 'services/search', data);
  }

  pharmacyCombo(data: Services){
    return this.httpClient.get(this.apiBaseUrl + 'pharmacy/search');
  }
  
  dosesCombo(data: any){
    return this.httpClient.post(this.apiBaseUrl + 'doses/search',data);
  }
  
  routeCombo(data: any){
    return this.httpClient.post(this.apiBaseUrl + 'route/search',data);
  }
  
  consumeCombo(data: any){
    return this.httpClient.post(this.apiBaseUrl + 'consume/search',data);
  }

  quantityCombo(data: any){
    return this.httpClient.post(this.apiBaseUrl + 'quantity/search',data);
  }

  doctorsCombo(data: Employee){
    return this.httpClient.post(this.apiBaseUrl + 'user/search', data);
  }
}
