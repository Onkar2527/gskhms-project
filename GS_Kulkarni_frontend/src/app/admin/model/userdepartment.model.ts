export class UserDepartments {
    id:number;
    userId:number;
    userName:string;
    deptId: number;
    deptName:string;
    subDeptId:number;
    subDeptName:string;
    startTimestamp: string;
    endTimestamp:string;
    status:string;
    hospitalId:number;
    constructor(){
        {
        this.id=0;
        this.userId=0;
        this.userName='';
        this.deptId=0;
        this.deptName='';
        this.subDeptId=0;
        this.subDeptName='';
        this.startTimestamp='';
        this.endTimestamp='';
        this.status='';
        this.hospitalId=0;
        }
    }
}