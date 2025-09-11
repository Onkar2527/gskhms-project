export class SubDepartmet{
 
    subDeptId:number;
    subDeptName: string;
    deptId:number;
    deptName:string;
    hospitalId: number;
    status:string;

    constructor(){
        {
        this.subDeptId=0;
        this.subDeptName='';
        this.hospitalId=0;
        this.deptId=0;
        this.deptName='';
        this.status='';
        }
    }
}