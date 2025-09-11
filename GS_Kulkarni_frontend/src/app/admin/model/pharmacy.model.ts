export class Pharmacy {
  id!: number;
  medecineName!: string;
  unitName!: string;
  content!: string;
  description!: string;
  pharmacyId: any;
  frequency!:string;
  dosage !:number;
  tillDays!:number;
  quantity !:number;
  diagnosis !:string;
  remark !:string;
  physioName!:string;


  constructor() {
    this.id = 0;
    this.medecineName = '';
    this.unitName = '';
    this.content = '';
    this.description = '';
    this.frequency='';
    this.dosage=0;
    this.tillDays=0;
    this.quantity=0;
    this.diagnosis="";
    this.remark="";
    this.physioName='';
  }

}