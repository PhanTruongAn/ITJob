export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T;
}

export interface IAccount {
  user: {
    id: string;
    email: string;
    name: string;
  };
  access_token: string;
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}
