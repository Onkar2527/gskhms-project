export class PackageMaster {
  id!: number;
  name!: string;
  charges!: number;
  packageType!: string;
  deptId!: number;
  constructor() {
    this.id = 0;
    this.name = '';
    this.charges=0;
    this.packageType = '';
    this.deptId = 0;
  }

}