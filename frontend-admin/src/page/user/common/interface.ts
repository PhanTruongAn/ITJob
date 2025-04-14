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

export interface IFilterUser {
  page: number;
  pageSize: number;
  sort?: string;
  name?: string | null;
  phone?: string | null;
}
