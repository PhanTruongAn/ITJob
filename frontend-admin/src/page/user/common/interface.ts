import { GenderEnum } from "./enums";

export interface ICreateUser {
  email: string;
  name: string;
  address: string;
  dob: Date;
  gender: GenderEnum;
}

export interface IEditUser {
  id: number;
  name: string;
  phone: string;
  address: string;
  dob: Date;
  gender: GenderEnum;
}
