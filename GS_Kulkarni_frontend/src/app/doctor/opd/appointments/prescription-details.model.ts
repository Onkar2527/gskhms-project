import { formatDate } from '@angular/common';
export class PrescriptionDetail {
  id!: number;
  medicineName!: string;
  morning!: number;
  afternoon!: number;
  evening!: number;
  route!: string;
  duration!: number;
  consume!: string;
  appoinment_id!: number;
  hospital_id!: number;
  prescriptionDate!: Date;
}
