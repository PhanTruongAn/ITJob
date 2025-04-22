import { IBackendPaginateRes, ICompany } from "../types/backend";
import axiosInstance from "../config/axios";
import { PATH_API } from "./constants/apiPath";
import { IReqCompany } from "../page/company/common/interface";
export async function fetchCompanies({
  page,
  pageSize,
  sort,
  name,
  address,
  companySize,
  companyType,
  countryId,
}: IReqCompany): Promise<IBackendPaginateRes<ICompany[]>> {
  const response = await axiosInstance.get<IBackendPaginateRes<ICompany[]>>(
    `${PATH_API.company.root}`,
    {
      params: {
        page: page,
        size: pageSize,
        name: name,
        address: address,
        companySize: companySize,
        companyType: companyType,
        countryId: countryId,
        ...(sort && { sort: sort }),
      },
    }
  );
  return response.data;
}
export async function signUploadLogo({});
