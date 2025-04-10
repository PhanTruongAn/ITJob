import { useState } from "react";
import { useUpdateState } from "../../../util/hooks";
export interface UserListState {
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  searchText?: string;
  sortBy?: string;
  visibleDeleteModal: boolean;
  visibleCreateModal: boolean;
  selectedUserId?: number | null;
}

export const useUserListState = () => {
  const [state, setState] = useState<UserListState>({
    page: 1,
    pageSize: 5,
    total: 0,
    sortBy: undefined,
    loading: true,
    searchText: undefined,
    visibleDeleteModal: false,
    visibleCreateModal: false,
    selectedUserId: null,
  });

  const updateState = useUpdateState(setState);

  return { state, updateState };
};
