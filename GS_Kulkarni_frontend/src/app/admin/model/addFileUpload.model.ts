export class AddFileUpload{

    userId:number;
    docType: string;
    docTypeId: string;
    name: string;
    startDate!: Date;
    docNumber: number;
    hospitalId: number;
    docPath: string;
    verifyStatus: string;
    verifyRemark: string;

    constructor() {
        this.userId=0;
        this.docType = '';
        this.docTypeId = '';
        this.name = '';
        this.docNumber = 0;
        this.hospitalId = 0;
        this.docPath = '';
        this.verifyStatus = '';
        this.verifyRemark = '';
    }
}