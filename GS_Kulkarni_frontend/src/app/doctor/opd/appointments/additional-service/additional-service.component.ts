import { MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Appointments } from '../appointments.model';
import { DatePipe, NgFor, NgClass, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MasterService } from 'app/admin/service/master.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

export interface DialogData {
  id: number;
  action: string;
  appointments: Appointments;
}

@Component({
  selector: 'app-additional-service',
  templateUrl: './additional-service.component.html',
  styleUrls: ['./additional-service.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogClose,
    MatTabsModule,
    NgFor,
    MatOptionModule,
    MatSelectModule,
    FeatherIconsComponent,
    DatePipe,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatRippleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    NgIf
  ],
})
export class AdditionalServiceComponent implements OnInit{
  @Output() changeService = new EventEmitter();
  @Input() appoinment_id:any;
  @Input() type: any;
  @Input() prescriptionDetails$: any;
  service!:any;

  serviceCombo$:any[]=[];
  constructor(
    private masterService:MasterService
  ) {
    // Set the defaults
  }

  ngOnInit() {
    this.loadService()  
    this.loadAppoinmentServiceDetails();
    this.addServiceDetails();
    this.getServiceName(this.service.id, this.type);
  
  }
  
  loadService(){
    this.masterService.getAllServices(this.type).subscribe((data:any)=>{
      this.serviceCombo$=data.data;
      this.loadAppoinmentServiceDetails();
    })
  }
 
  addServiceDetails(){
    if(!this.service){
      return
    }
    this.serviceCombo$.find((data:any)=>data.id===this.service.id && data.type===this.service.type)
    let data={
      id:0,
      appointmentId: this.appoinment_id,
      serviceId: this.service.id,
      charges: this.service.charges,
      type: this.service.type,
      packageType: this.type
    }
    this.masterService.addAppoinmentServiceDetails(data).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {   
        this.loadAppoinmentServiceDetails();
        this.service=null;  
      } 
    });
  }
  // prescriptionDetails$!:any;

  loadAppoinmentServiceDetails(){
    let data = {
        "appointmentId": this.appoinment_id,
        "type": this.type,
         "labNoGenerated": "N"
      }
    this.prescriptionDetails$=[];
    this.masterService.getAppoinmentServiceDetails(data).subscribe((res:any)=>{
      this.prescriptionDetails$! = res.data;
      if(this.prescriptionDetails$!.length > 0){
        this.changeService.emit(true);
      }
    })
  }

  deleteAppoinmentServicesDtl(id:any){
    this.masterService.deleteAppoinmentServiceDetails(id).subscribe((res:any)=>{
      this.loadAppoinmentServiceDetails();
    })
  }
  
  getServiceName(id:any,type:any){
    return this.serviceCombo$.find(data=>data.id===id && data.type===type)?.name || '';
 }
}
