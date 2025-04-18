import { useState } from "react";
import { useUpdateState } from "../../../util/hooks";
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

export const useCompanyState = () => {
  const [state, setState] = useState<CompanyState>({
    page: 1,
    pageSize: 5,
    total: 0,
    sort: undefined,
    loading: false,
    name: null,
    address: null,
    companySize: null,
    companyType: null,
    countryId: null,
    visibleDeleteModal: false,
    visibleEditModal: false,
    selectedCompany: undefined,
    selectedCompanyId: null,
    typeModal: "view",
  });

  const updateState = useUpdateState(setState);

  return { state, updateState };
};
