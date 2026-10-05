import { API_PATHS } from "@/common/apiPaths"
import { fetchWithAuth } from "@/common/hooks/fetchWithAuth"
import { IApiResponse } from "../common/response.types"
import {
  IBookmarkPageReq,
  ISavedCompany,
  ISavedCompanyPage,
  ISavedJob,
  ISavedJobPage,
} from "./bookmark.types"

export const bookmarkApi = {
  getSavedJobs: (params: IBookmarkPageReq) =>
    fetchWithAuth<IApiResponse<ISavedJobPage>>(`${API_PATHS.BOOKMARKS}/jobs`, {
      method: "GET",
      params,
    }),

  saveJob: (jobId: number) =>
    fetchWithAuth<IApiResponse<ISavedJob>>(`${API_PATHS.BOOKMARKS}/jobs`, {
      method: "POST",
      data: { jobId },
    }),

  unsaveJob: (savedJobId: number) =>
    fetchWithAuth<IApiResponse<void>>(
      `${API_PATHS.BOOKMARKS}/jobs/${savedJobId}`,
      { method: "DELETE" },
    ),

  getSavedCompanies: (params: IBookmarkPageReq) =>
    fetchWithAuth<IApiResponse<ISavedCompanyPage>>(
      `${API_PATHS.BOOKMARKS}/companies`,
      { method: "GET", params },
    ),

  saveCompany: (companyId: number) =>
    fetchWithAuth<IApiResponse<ISavedCompany>>(
      `${API_PATHS.BOOKMARKS}/companies`,
      { method: "POST", data: { companyId } },
    ),

  unsaveCompany: (savedCompanyId: number) =>
    fetchWithAuth<IApiResponse<void>>(
      `${API_PATHS.BOOKMARKS}/companies/${savedCompanyId}`,
      { method: "DELETE" },
    ),
}
