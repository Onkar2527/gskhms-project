import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { EmployeeService } from '../../employees.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Employee } from '../../employees.model';

// export interface DialogData {
//   id: number;
//   name: string;
//   designation: string;
//   mobile: string;
// }

@Component({
    selector: 'app-delete:not(n)',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.scss'],
    standalone: true,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatDialogClose,
    ],
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employee,
    public employeeService: EmployeeService,
    private _snackBar: MatSnackBar,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  
  confirmDelete() {
    this.employeeService.deleteEmployee(this.data.employeeId).subscribe((result: any) => {
      console.log("result  " , result);
      if (result['message']) {
        this.openSnackBar(result['message']);
        this.dialogRef.close({ status: 0 });
      }
      else {
        this.openSnackBar(result['message']);
      }
    })
  }
  
  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
