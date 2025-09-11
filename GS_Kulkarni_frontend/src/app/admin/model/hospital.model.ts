export class Hospital
{
  id!: number; 
  name!: string;
  hospitalCode!: string;
  regNo!: string;
  licNo!: string;
  mobileNumber!: string;
  email!: string;
  address!: string;
  status!: string;
  area!: string;
  taluka! :string;
  district! :string;
  state! :string;
  pinCode!:number;
  hospitalId: any;
  labServices!: string;
  xrayServices!: string;
  sonographyServices!: string;
  ipdServices!: string;
  discountApplicable!: string;
  insuranceAvailable!: string;

  constructor(){
  this.id =0;
  this.name='';
  this.hospitalCode='';
  this.regNo='';
  this.licNo='';
  this.mobileNumber='';
  this.email= '';
  this.address='';
  this.status='';
  this.area='';
  this.taluka='';
  this.district='';
  this.state='';
  this.pinCode=0;
  }

}