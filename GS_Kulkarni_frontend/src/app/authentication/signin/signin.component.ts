import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UnsubscribeOnDestroyAdapter } from '../../shared';
import { AuthService, Role, User } from '../../core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from '../login.service';
@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
    ],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  private currentUserSubject: BehaviorSubject<User>;
  authForm!: UntypedFormGroup;
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  selectedRole = '';
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private authService: AuthService,
    private loginService:LoginService
  ) {
    super();
    localStorage.removeItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
  }

  ngOnInit() {
    if(localStorage.getItem('rememberMe')){
      this.selectedRole = localStorage.getItem('role') ?? Role.Admin;
      this.authForm = this.formBuilder.group({
        username: [localStorage.getItem('username'), Validators.required],
        password: [localStorage.getItem('password'), Validators.required],
        rememberMe: [JSON.parse(localStorage.getItem('rememberMe') ?? 'false'), Validators.required],
      });
    } else {
      this.selectedRole = Role.Admin;
      this.authForm = this.formBuilder.group({
        username: ['testadmin@hospital.org', Validators.required],
        password: ['testadmin', Validators.required],
        rememberMe: [false]
      });
    }
  }

  get f() {
    return this.authForm.controls;
  }
  
  adminSet() {
    this.selectedRole = Role.Admin;
    this.authForm.get('username')?.setValue('testadmin@hospital.org');
    this.authForm.get('password')?.setValue('testadmin');
  }
  
  doctorSet() {
    this.selectedRole = Role.Doctor;
    this.authForm.get('username')?.setValue('testdoctor@hospital.org');
    this.authForm.get('password')?.setValue('testadmin');
  }
  
  patientSet() {
    this.selectedRole = Role.Receptionist;
    this.authForm.get('username')?.setValue('testreception@hospital.org');
    this.authForm.get('password')?.setValue('testadmin');
  }

  nurseSet() {
    this.selectedRole = Role.Nurse;
    this.authForm.get('username')?.setValue('testnurse@hospital.org');
    this.authForm.get('password')?.setValue('testadmin');
  }

  labSet() {
    this.selectedRole = Role.Lab;
    this.authForm.get('username')?.setValue('testlab@hospital.org');
    this.authForm.get('password')?.setValue('testadmin');
  }

  accountSet() {
    this.selectedRole = Role.Accountant;
    this.authForm.get('username')?.setValue('testaccountant@hospital.org');
    this.authForm.get('password')?.setValue('testadmin');
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      this.subs.sink = ((this.authService
        .login(this.f['username'].value, this.f['password'].value)))
        .subscribe({
          next: (res) => {
            let response: any = res;
            if (response['data']) {
                let data = response['data'];
                if (data && data == this.f['username'].value) {
                  this.error = 'Invalid Login';
                } else if (data) {
                  const user = new User();
                  user.token = data ? data.token : '';
                  const current = new Date();
                  const timestamp = current.getTime();
                  user.expiresIn = data ? timestamp+data.expiresIn : 0;
                  user.id = data?.userList[0].employeeId;
                  if(data?.userList[0].gender == 'M'){
                    user.img = 'assets/images/image-gallery/maleavtar.png';
                  }else{
                    user.img = 'assets/images/image-gallery/femaleavatar.png';
                  }
                  user.username = data?.userList[0].emailId;
                  user.firstName = data?.userList[0].firstName;
                  user.lastName = data?.userList[0].lastName;
                  user.hospitalId = data?.userList[0].hospitalId;
                  user.hospitalCode = data?.userList[0].hospitalCode;
                  user.labServices = data?.userList[0].labServices;
                  user.xrayServices = data?.userList[0].xrayServices;
                  user.ipdServices = data?.userList[0].ipdServices;
                  user.discountApplicable = data?.userList[0].discountApplicable;
                  user.insuranceAvailable = data?.userList[0].insuranceAvailable;

                  if(data?.userList[0].userType == 'D'){
                    user.role = Role.Doctor;
                  } else if(data?.userList[0].userType == 'R'){
                    user.role = Role.Receptionist;
                  } else if(data?.userList[0].userType == 'AC'){
                    user.role = Role.Accountant;
                  } else if(data?.userList[0].userType == 'A'){
                    user.role = Role.Admin;
                  } else if(data?.userList[0].userType == 'L'){
                    user.role = Role.Lab;
                  }else if(data?.userList[0].userType == 'N'){
                    user.role = Role.Nurse;
                  }
                  if (user) {
                    this.loginService.logCurrentUserData(user);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                  } else {
                    this.error = 'Invalid Login';
                  }
                }
                const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
                const role = currentUser.role;
                if(this.authForm.controls['rememberMe'].value){
                  localStorage.setItem('username', this.authForm.controls['username'].value);
                  localStorage.setItem('password',this.authForm.controls['password'].value);
                  localStorage.setItem('role', role);
                  localStorage.setItem('rememberMe', JSON.stringify(this.authForm.controls['rememberMe'].value));
                } else {
                  localStorage.removeItem('username');
                  localStorage.removeItem('password');
                  localStorage.removeItem('role');
                  localStorage.removeItem('rememberMe');
                }
                this.loading = false;
                if (role === Role.All || role === Role.Admin) {
                  this.router.navigate(['/admin/dashboard/main']);
                } else if (role === Role.Doctor) {
                  this.router.navigate(['/doctor/dashboard']);
                } else if (role === Role.Receptionist) {
                  this.router.navigate(['/reception/dashboard']);
                }  else if (role === Role.Accountant) {
                  this.router.navigate(['/accountant/dashboard']);
                } else if (role === Role.Nurse) {
                  this.router.navigate(['/nurse/dashboard']);
                } else if (role === Role.Lab) {
                  this.router.navigate(['/lab/dashboard']);
                } else {
                  this.router.navigate(['/authentication/signin']);
                }
            } else {
              this.error = 'Invalid Login';
              this.loading = false;
            }
          },
          error: (error) => {
            this.error = error;
            this.submitted = false;
            this.loading = false;
          },
        });
    }
  }

}
