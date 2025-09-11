export class PatientsCategory{

    id:number;
    name: string;
    type:string;
    status: string;
    hospitalId: number;

    constructor(){
        {
        this.id=0;
        this.name='';
        this.type='';
        this.status='';
        this.hospitalId=0;
        }
    }
}