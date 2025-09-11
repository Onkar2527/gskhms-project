import { formatDate } from '@angular/common';
export class DepartmentList {
  deptId: number;
  d_no: string;
  deptName: string;
  description: string;
  d_date: string;
  d_head: string;
  status: string;
  hospitalId:number;
  sectionId: number;
  sectionName: string;
  constructor() {
    {
      this.deptId = 0
      this.d_no = '';
      this.deptName = '';
      this.description =  '';
      this.d_date =  '';
      this.d_head = '';
      this.status = '';
      this.hospitalId =0;
      this.sectionId = 0;
      this.sectionName='';
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
