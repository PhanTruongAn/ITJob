import { createUser, deleteUser, editUser } from "../../../apis/userModule";
import CustomHooks from "../../../common/hooks/CustomHooks";

export const useCreateUser = () => {
  return CustomHooks.useMutation(createUser);
};

export const useDeleteUser = () => {
  return CustomHooks.useMutation(deleteUser);
};

export const useEditUser = () => {
  return CustomHooks.useMutation(editUser);
};
