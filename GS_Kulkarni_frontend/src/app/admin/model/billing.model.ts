export class Billing{
  id!:number;
  documentNumber!:string;
  patientName!: string;
  doctorName!:string;
  mobileNumber!:number;
  paidAmount!:number;
  taxableAmount!:number;
  totalTax!:  number;      
  grandTotal!:number;
  hospitalId!: number;
  balanceAmount!: number;
  billingDate!: Date;
  patientUHIDNumber!: string;
  address!: string;
  billingStatus!: string;
  createdBy!: string;
  billingStartDate!: Date;
  billingEndDate!: Date;
}

