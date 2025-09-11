import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { catchError } from 'rxjs';
import { EmployeeService } from 'app/admin/employees/allemployees/employees.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        RouterLink,
    ],
})
export class ForgotPasswordComponent implements OnInit {
  authForm!: UntypedFormGroup;
  submitted = false;
  returnUrl!: string;
  hide = true;
  error = '';
  constructor(
    public employeeService: EmployeeService,
    private _snackBar: MatSnackBar,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      emailId: [
        '',
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(5)],
      ],
      reEnterPassword: [
        '',
        [Validators.required, Validators.minLength(5)],
      ],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.controls['password'].value != this.authForm.controls['reEnterPassword'].value) {
      this.error = 'Entered passwords are not matching!';
      return;
    } else {
        this.employeeService.updatePassword(this.authForm.value).pipe(
          catchError(() => {
            this.openSnackBar('Error occurred to update password');
            return '';
          })
        ).subscribe((result: any) => {
          if (result['message'] == 'Password updated Successfully') {
            this.openSnackBar(result['message']);
            this.router.navigate(['/authentication/signin']);
          } 
        })
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
