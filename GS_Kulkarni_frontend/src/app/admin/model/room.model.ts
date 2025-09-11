export class Room {
  id!: number;
  name!: string;
  floorId!:number;
  roomTypeId!:number;



  constructor() {
    this.id = 0;
    this.floorId=0;
    this.roomTypeId=0;
    this.name = '';
  }

}