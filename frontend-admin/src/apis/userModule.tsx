import axios from "../config/axios";
import {
  ICreateUser,
  IEditUser,
  IFilterUser,
} from "../page/user/common/interface";
import { IBackendRes, IUser, IBackendPaginateRes } from "../types/backend";
import { PATH_API } from "./constants/apiPath";

export async function fetchUsers({
  page,
  pageSize,
  sort,
  phone,
  name,
}: IFilterUser): Promise<IBackendPaginateRes<IUser[]>> {
  const response = await axios.get<IBackendPaginateRes<IUser[]>>(
    `${PATH_API.user.filter}`,
    {
      params: {
        page,
        size: pageSize,
        phone,
        name,
        ...(sort && { sort }),
      },
    }
  );
  return response.data;
}

export async function createUser(
  data: ICreateUser
): Promise<IBackendRes<IUser>> {
  const response = await axios.post<IBackendRes<IUser>>(
    `${PATH_API.user.root}`,
    data
  );
  return response.data;
}

export async function deleteUser({
  id,
}: {
  id: number;
}): Promise<IBackendRes<IUser>> {
  const response = await axios.delete<IBackendRes<IUser>>(
    `${PATH_API.user.root}/${id}`
  );
  return response.data;
}

export async function getUserById({
  id,
}: {
  id: number;
}): Promise<IBackendRes<IUser>> {
  const response = await axios.get<IBackendRes<IUser>>(
    `${PATH_API.user.root}/${id}`
  );
  return response.data;
}

export async function editUser(data: IEditUser): Promise<IBackendRes<IUser>> {
  const response = await axios.put<IBackendRes<IUser>>(
    `${PATH_API.user.root}`,
    data
  );
  return response.data;
}
