import { GenderEnum } from "./enums";

export interface ICreateUser {
  email: string;
  name: string;
  address: string;
  dob: Date;
  gender: GenderEnum;
}
