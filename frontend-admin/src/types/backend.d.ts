import { ECompany, GenderEnum } from "./enum";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";
export interface IBackendPaginateRes<T> {
  statusCode: number;
  error: any;
  message: string;
  data: {
    meta: {
      pageNumber?: number;
      pageSize?: number;
      pages?: number;
      total?: number;
    };
    result: T;
  };
}

export interface IBackendRes<T> {
  statusCode: number;
  error: any;
  message: string;
  data: T;
}
export interface IFetchDataParams {
  page: number;
  pageSize: number;
  sort?: string;
}
export interface IAccount {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  access_token: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  gender: GenderEnum;
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Country
export interface ICountry {
  id: number;
  code: string;
  name: string;
}
// Company

export interface ICompany {
  id: number;
  name: string;
  address: string;
  companyType: ECompany;
  companySize: string;
  industry: string;
  overtime: boolean;
  description: string;
  logo: string;
  workingDays: DayOfWeek[];
  country: ICountry;
}

export interface ICloud {
  timestamp: number;
  cloudName: string;
  apiKey: string;
  signature: string;
  uploadUrl: string;
  uploadPreset: string;
}
// IGetAccount inherits from IAccount but excludes access_token

export interface IParamLogin {
  email: string;
  password: string;
}
export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface ICreateCompanyDTO extends Omit<ICompany, "id"> {}
export interface IEditCompanyDTO extends Omit<ICompany, "country"> {}
