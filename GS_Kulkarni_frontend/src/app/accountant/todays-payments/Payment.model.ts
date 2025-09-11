export class Payment {
    id!: number;
    documentNumber!: string;
    paymentDate!: Date;
    hospitalId!: number;
    appointmentId!: number;
    billingId!: number;
    paymentMode!: string;
    transactionNumber!: string;
    amount!: number;
    paymentStatus!: string;
    serviceName!: string;
    appointmentNumber!: string;
    firstName!: string;
    lastName!: string;
    mobileNumber!: string;
    uhidnumber!: string;
    description!: string;
    appointmentServiceList!:any;
    createdBy!: string;
    paymentStartDate!: Date;
    cashAmount!: number;
    onlineAmount!:number;
    paymentEndDate!: Date;
}