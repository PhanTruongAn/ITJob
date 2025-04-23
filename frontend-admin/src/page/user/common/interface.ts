import { IUser } from "../../../types/backend";
import { GenderEnum } from "../../../types/enum";
export interface UserListState {
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  filterPhone?: string | null;
  filterName?: string | null;
  sortBy?: string;
  visibleDeleteModal: boolean;
  visibleCreateModal: boolean;
  visibleEditModal: boolean;
  selectedUser: IUser | undefined;
  selectedUserId?: number | null;
  typeModal: "view" | "edit";
}

export interface ICreateUser {
  email: string;
  name: string;
  address: string;
  dob: Date;
  gender: GenderEnum;
}

export interface IEditUser {
  id: number;
  name: string;
  phone: string;
  address: string;
  dob: Date;
  gender: GenderEnum;
}

export interface IFilterUser {
  page: number;
  pageSize: number;
  sort?: string;
  name?: string | null;
  phone?: string | null;
}
