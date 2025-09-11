export class Bed {
  id!: number;
  name!: string;
  roomId!:number;
  roomName!: string;
  status!: string;
  hospitalId!: number;
  note!: string;
  appointmentId!: number;

  constructor() {
    this.id = 0;
    this.roomId=0;
    this.name = '';
  }

}