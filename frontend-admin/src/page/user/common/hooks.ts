import { useState } from "react";
import { useUpdateState } from "../../../util/hooks";
import CustomHooks from "../../../common/hooks/CustomHooks";
import { createUser, deleteUser, editUser } from "../../../apis/userModule";
import { UserListState } from "./interface";

export const useUserListState = () => {
  const [state, setState] = useState<UserListState>({
    page: 1,
    pageSize: 5,
    total: 0,
    sortBy: undefined,
    loading: true,
    filterPhone: null,
    filterName: null,
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

export const useCreateUser = () => {
  return CustomHooks.useMutation(createUser);
};

export const useDeleteUser = () => {
  return CustomHooks.useMutation(deleteUser);
};

export const useEditUser = () => {
  return CustomHooks.useMutation(editUser);
};
