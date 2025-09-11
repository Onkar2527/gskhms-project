import { Role } from './role';

export class User {
  id!: number;
  img!: string;
  username!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role!: Role;
  token!: string;
  expiresIn!: number;
  hospitalId!: number;
  hospitalCode!: string;
  labServices!: string;
  xrayServices!: string;
  sonographyServices!: string;
  ipdServices!: string;
  discountApplicable!: string;
  insuranceAvailable!: string;
}
