import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from './employees.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '../../../shared';
import { ConfigService } from '../../../config';
import { Doctor } from 'app/admin/doctors/doctor.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/employees.json';
  apiBaseUrl: string = "";
  isTblLoading = true;
  dataChange: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  // Temporarily stores data from dialogs
  dialogData!: Employee;
  constructor(private httpClient: HttpClient, private config: ConfigService) {
    super();
    this.apiBaseUrl = config.getApiUrl();
  }
  get data(): Employee[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllEmployees(): void {
    this.subs.sink = this.httpClient.get<Employee[]>(this.API_URL).subscribe({
      next: (data) => {
        this.isTblLoading = false;
        this.dataChange.next(data);
      },
      error: (error: HttpErrorResponse) => {
        this.isTblLoading = false;
        console.log(error.name + ' ' + error.message);
      },
    });
  }

  getAllDoctors(): void {
    const data1 = new Employee();
    data1.userType = 'D';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'user/search', data1).subscribe({
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

  getEmployeeData(): void {
    const data1 = new Employee();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data1.hospitalId = currentUser.hospitalId;
    this.subs.sink = this.httpClient.post<any>(this.apiBaseUrl + 'user/search', data1).subscribe({
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

  getEmployeeDataById(empid: number) {
    const data = new Employee();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data.hospitalId = currentUser.hospitalId;
    data.employeeId = empid;
    return this.httpClient.post(this.apiBaseUrl + 'user/search', data);
  }

  getDoctorDataById(empid: number) {
    const data = new Employee();
    data.userType = 'D';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    data.hospitalId = currentUser.hospitalId;
    data.employeeId = empid;
    return this.httpClient.post(this.apiBaseUrl + 'user/search', data);
  }


  addEmployee(employee: Employee) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    employee.hospitalId = currentUser.hospitalId;
    return this.httpClient.post(this.apiBaseUrl + 'user/save', employee);
  }

  addEmployeeData(formData: FormData) {
    return this.httpClient.post(this.apiBaseUrl + 'user/saveData', formData);
  }

  updateEmployee(formData: FormData) {
    return this.httpClient.put(this.apiBaseUrl + 'user/update', formData);
  }

  deleteEmployee(id: number) {
    return this.httpClient.delete(this.apiBaseUrl + 'employee/delete?id=' + id);
  }

  getDepartments(data:any) {
    return this.httpClient.post(this.apiBaseUrl + 'dept/search', data);
  }

  updatePassword(employee: Employee) {
    return this.httpClient.put(this.apiBaseUrl + 'user/updatePassword', employee);
  }

  addDoctor(doctor: Doctor) {
    return this.httpClient.post(this.apiBaseUrl + 'doctor/saveData', doctor);
  }

  updateDoctor(doctor: Doctor) {
    return this.httpClient.put(this.apiBaseUrl + 'doctor/update', doctor);
  }
  
}
