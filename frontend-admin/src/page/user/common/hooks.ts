import { useState } from "react";
import { useUpdateState } from "../../../util/hooks";
import { IUser } from "../../../types/backend";
export interface UserListState {
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  searchText?: string;
  sortBy?: string;
  visibleDeleteModal: boolean;
  visibleCreateModal: boolean;
  visibleEditModal: boolean;
  selectedUser: IUser | undefined;
  selectedUserId?: number | null;
  typeModal: "view" | "edit";
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
    visibleEditModal: false,
    selectedUser: undefined,
    selectedUserId: null,
    typeModal: "view",
  });

  const updateState = useUpdateState(setState);

  return { state, updateState };
};
