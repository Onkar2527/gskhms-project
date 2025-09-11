export class Bank {
    bankId:number;
    userId:number;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    branchName:string;
    userName:string;

    constructor(){
        {
        this.bankId=0;
        this.userId=0;
        this.accountHolderName='';
        this.accountNumber='';
        this.ifscCode='';
        this.branchName='';
        this.userName='';
        }
    }
}