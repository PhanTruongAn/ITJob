import { ICompany } from "../../../types/backend";
import { ECompanyType } from "../../../types/enum";

export interface CompanyState {
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  name?: string | null;
  address?: string | null;
  companySize?: string | null;
  companyType?: ECompanyType | null;
  countryId?: number | null;
  sort?: string;
  visibleDeleteModal: boolean;
  visibleEditModal: boolean;
  selectedCompany: ICompany | undefined;
  selectedCompanyId?: number | null;
  typeModal: "view" | "edit";
}
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
