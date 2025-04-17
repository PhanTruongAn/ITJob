import { ECompanyType } from "../../../types/enum";

export interface IReqCompany {
  page: number;
  pageSize: number;
  sort?: string;
  name?: string | null;
  address?: string | null;
  companySize?: string | null;
  companyType?: ECompanyType | null;
  countryId: number | null;
}

export interface IFilterCompany {
  name?: string | null;
  address?: string | null;
  companySize?: string | null;
  companyType?: ECompanyType | null;
  countryId: number | null;
}
