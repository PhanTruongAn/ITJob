import axiosInstance from "../config/axios"
import { IBackendPaginateRes, IBackendRes, ISubscriber } from "../types/backend"
import { PATH_API } from "./constants/apiPath"

export async function fetchSubscribers(params: {
  page?: number
  pageSize?: number
  sort?: string
  name?: string
}): Promise<IBackendPaginateRes<ISubscriber[]>> {
  const q = new URLSearchParams()
  if (params.page) q.append("page", params.page.toString())
  if (params.pageSize) q.append("size", params.pageSize.toString())
  if (params.sort) q.append("sort", params.sort)
  if (params.name) q.append("name", params.name)

  const response = await axiosInstance.get<IBackendPaginateRes<ISubscriber[]>>(
    `${PATH_API.subscriber.root}?${q.toString()}`
  )
  return response.data
}

export async function createSubscriber(
  data: Omit<ISubscriber, "id">
): Promise<IBackendRes<ISubscriber>> {
  const response = await axiosInstance.post<IBackendRes<ISubscriber>>(
    PATH_API.subscriber.root,
    data
  )
  return response.data
}

export async function updateSubscriber(
  data: ISubscriber
): Promise<IBackendRes<ISubscriber>> {
  const response = await axiosInstance.put<IBackendRes<ISubscriber>>(
    PATH_API.subscriber.root,
    data
  )
  return response.data
}

export async function deleteSubscriber({ id }: { id: number }) {
  const response = await axiosInstance.delete<IBackendRes<any>>(
    `${PATH_API.subscriber.root}/${id}`
  )
  return response.data
}

export async function getSubscriberById({ id }: { id: number }) {
  const response = await axiosInstance.get<IBackendRes<ISubscriber>>(
    `${PATH_API.subscriber.root}/${id}`
  )
  return response.data
}
