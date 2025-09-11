import { formatDate } from '@angular/common';
export class Doctors {
  id: number;
  img: string;
  name: string;
  email: string;
  dateOfJoining: string;
  specialization: string;
  mobile: string;
  department: string;
  designation: string;
  hospitalId!:number;
  constructor(doctors: Doctors) {
    {
      this.id = doctors.id || this.getRandomID();
      this.img = doctors.img || 'assets/images/user/user1.jpg';
      this.name = doctors.name || '';
      this.email = doctors.email || '';
      this.dateOfJoining = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.specialization = doctors.specialization || '';
      this.mobile = doctors.mobile || '';
      this.department = doctors.department || '';
      this.designation = doctors.designation || '';
      
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
