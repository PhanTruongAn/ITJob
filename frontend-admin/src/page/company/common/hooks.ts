import { useState } from "react";
import { useUpdateState } from "../../../util/hooks";
import { ICompany } from "../../../types/backend";
export interface CompanyState {
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  filterName?: string | null;
  sortBy?: string;
  visibleDeleteModal: boolean;
  visibleCreateModal: boolean;
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
    sortBy: undefined,
    loading: false,
    filterName: null,
    visibleDeleteModal: false,
    visibleCreateModal: false,
    visibleEditModal: false,
    selectedCompany: undefined,
    selectedCompanyId: null,
    typeModal: "view",
  });

  const updateState = useUpdateState(setState);

  return { state, updateState };
};
