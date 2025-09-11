import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { Room } from 'app/admin/model/room.model';

import { DropdownService } from 'app/admin/service/dropdown.service';
import { MasterService } from 'app/admin/service/master.service';

@Component({
  selector: 'app-add-room',
  standalone: true,
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.scss',
  imports: [
    SharedModule
  ]
})
export class AddRoomComponent {
  roomTypeOptions: any[] = [];
  floorOptions: any[] = [];
  panleTitle: string = 'Add Room';
  roomForm: any;
  id: any;
  room: Room = new Room();
  formdata = {
    id: null,
    name: null,
    roomTypeId:null,
    floorId:null
  };
  constructor(private fb: UntypedFormBuilder,
    public masterService: MasterService,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dropDownService: DropdownService
  ) {
    const urlData: any = this.router.getCurrentNavigation()?.extras?.state;
    if (urlData?.roomData) {
      this.id = urlData.roomData.id;
      this.room = <Room>urlData.roomData;
      
    }
  }
  
  loadRoom(){
    this.masterService.getRoomType({}).subscribe((data:any)=>{
      this.roomTypeOptions=data.data;
    })
  }

  loadFloor(){
    this.masterService.getFloor({}).subscribe((data:any)=>{
      this.floorOptions=data.data;
    })
  }

  ngOnInit(): void {
    const req = new Room();
    req.id = this.id;
    if(this.id){
      this.panleTitle = 'Edit Room';
    }
    this.loadRoom();
    this.loadFloor();
    this.roomForm = this.createContactForm();
    this.setRouteDataForEdit();
    
    
  }

  setRouteDataForEdit() {
    this.roomForm.patchValue({
      id:this.room?.id,
      name:this.room?.name,
      roomTypeId:this.room?.roomTypeId,
      floorId:this.room?.floorId,
    });
  }

  onSubmit() {
    this.masterService.addRoom(this.roomForm.value).subscribe((result: any) => {
      if (result['message'] == 'Data Saved Successfully') {
        this.openSnackBar(result['message']);
        this.router.navigate(['/admin/master/room-list']);
      } else {
        this.openSnackBar(result['message']);
      }
    });
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.formdata.id],
      name: [
        this.formdata.name,
        [Validators.required],
      ],
      roomTypeId: [
        this.formdata.roomTypeId,
        [Validators.required],
      ],
      floorId: [
        this.formdata.floorId,
        [Validators.required],
      ]
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
