export class PatientCompany{

    id:number;
    name: string;
    categoryId:number;
    categoryName:string;
    rateTypeId:number;
    rateName:string;
    status: string;
    hospitalId: number;

    constructor(){
        {
        this.id=0;
        this.name='';
        this.categoryId=0;
        this.categoryName='';
        this.rateTypeId=0;
        this.rateName='';
        this.status='';
        this.hospitalId=0;
        }
    }
}