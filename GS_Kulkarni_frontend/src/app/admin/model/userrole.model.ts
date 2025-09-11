export class UserRole {
    id:number;
    userId:number;
    userName:string;
    roleId: number;
    roleName:string;
    startTimestamp: string;
    endTimestamp:string;
    status:string;
    hospitalId:number;
    constructor(){
        {
        this.id=0;
        this.userId=0;
        this.userName='';
        this.roleId=0;
        this.roleName='';
        this.startTimestamp='';
        this.endTimestamp='';
        this.status='';
        this.hospitalId=0;
        }
    }
}