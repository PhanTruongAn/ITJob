export interface IBackendRes<T> {
  error?: string | string[];
  message: string;
  statusCode: number | string;
  data?: T | string;
}

export interface IAccount {
  access_token: string;
  user: {
      id: string;
      email: string;
      name: string;
  }
}
