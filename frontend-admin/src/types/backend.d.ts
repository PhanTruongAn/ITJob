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
// IGetAccount inherits from IAccount but excludes access_token
export interface IGetAccount extends Omit<IAccount, "access_token"> {}
