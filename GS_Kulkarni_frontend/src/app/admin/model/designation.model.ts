export class Designation {
    id:number;
    type: string;
    name: string;
    status: string;
    hospitalId: number;

    constructor(){
        {
        this.id=0;
        this.type='';
        this.name='';
        this.status='';
        this.hospitalId=0;
        }
    }
}