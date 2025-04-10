import axios from "../config/axios";
import { ICreateUser } from "../page/user/common/interface";
import { IBackendRes, IFetchDataParams, IUser } from "../types/backend";

export async function fetchUsers({
  page,
  pageSize,
  sort,
}: IFetchDataParams): Promise<IBackendRes<IUser[]>> {
  const response = await axios.get<IBackendRes<IUser[]>>("/api/v1/users", {
    params: {
      page,
      size: pageSize,
      ...(sort && { sort }),
    },
  });
  return response.data;
}

export async function createUser(
  data: ICreateUser
): Promise<IBackendRes<IUser[]>> {
  const response = await axios.post<IBackendRes<IUser[]>>(
    "/api/v1/users",
    data
  );
  return response.data;
}

export async function deleteUser({
  id,
}: {
  id: number;
}): Promise<IBackendRes<IUser[]>> {
  const response = await axios.delete<IBackendRes<IUser[]>>(
    `/api/v1/users/${id}`
  );
  return response.data;
}
