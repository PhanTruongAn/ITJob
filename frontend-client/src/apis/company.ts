import axiosPublic from "@/configs/axiosPublic"
import { assertApiSuccess } from "@/common/utils/queryBehavior.mjs"
import { IBackendPaginateRes, IBackendRes, ICompany } from "@/types/backend"
import { PATH_API } from "./constants/apiPath"

interface FetchCompaniesParams {
  page?: number
  pageSize?: number
  name?: string
  address?: string
  companySize?: string
  companyType?: string
  countryId?: number
  status?: string
  sort?: string
}

export async function fetchCompanies(
  params: FetchCompaniesParams,
): Promise<IBackendPaginateRes<ICompany[]>> {
  const response = await axiosPublic.get<IBackendPaginateRes<ICompany[]>>(
    PATH_API.company.root,
    {
      params: {
        page: params.page,
        size: params.pageSize,
        name: params.name,
        address: params.address,
        companySize: params.companySize,
        companyType: params.companyType,
        countryId: params.countryId,
        status: params.status,
        sort: params.sort,
      },
    },
  )
  return assertApiSuccess(response.data)
}

export async function getCompanyById(
  id: number,
): Promise<IBackendRes<ICompany>> {
  const response = await axiosPublic.get<IBackendRes<ICompany>>(
    `${PATH_API.company.root}/${id}`,
  )
  return assertApiSuccess(response.data)
}
