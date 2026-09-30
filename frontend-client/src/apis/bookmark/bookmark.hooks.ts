import CustomHooks from "@/common/hooks/customHooks"
import { QUERY_KEYS } from "@/common/queryKeys"
import { useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { IApiResponse } from "../common/response.types"
import { bookmarkApi } from "./bookmark.api"
import {
  IBookmarkPageReq,
  ISavedCompany,
  ISavedCompanyPage,
  ISavedJob,
  ISavedJobPage,
} from "./bookmark.types"
import { isCandidateRole } from "@/common/security/frontendSecurity.mjs"

const SAVED_STATE_PAGE_SIZE = 100

const bookmarkKeys = {
  jobs: (userId: string) => [QUERY_KEYS.BOOKMARK_MODULE, "jobs", userId] as const,
  jobIndex: (userId: string) =>
    [QUERY_KEYS.BOOKMARK_MODULE, "jobs", userId, "index"] as const,
  jobList: (userId: string, params: IBookmarkPageReq) =>
    [QUERY_KEYS.BOOKMARK_MODULE, "jobs", userId, "list", params] as const,
  companies: (userId: string) =>
    [QUERY_KEYS.BOOKMARK_MODULE, "companies", userId] as const,
  companyIndex: (userId: string) =>
    [QUERY_KEYS.BOOKMARK_MODULE, "companies", userId, "index"] as const,
  companyList: (userId: string, params: IBookmarkPageReq) =>
    [QUERY_KEYS.BOOKMARK_MODULE, "companies", userId, "list", params] as const,
}

async function getAllSavedJobs(): Promise<ISavedJob[]> {
  const firstPage = await bookmarkApi.getSavedJobs({
    page: 1,
    size: SAVED_STATE_PAGE_SIZE,
  })
  const allSavedJobs = [...(firstPage.data?.result ?? [])]

  for (let page = 2; page <= (firstPage.data?.meta?.pages ?? 1); page += 1) {
    const response = await bookmarkApi.getSavedJobs({
      page,
      size: SAVED_STATE_PAGE_SIZE,
    })
    allSavedJobs.push(...(response.data?.result ?? []))
  }

  return allSavedJobs
}

async function getAllSavedCompanies(): Promise<ISavedCompany[]> {
  const firstPage = await bookmarkApi.getSavedCompanies({
    page: 1,
    size: SAVED_STATE_PAGE_SIZE,
  })
  const allSavedCompanies = [...(firstPage.data?.result ?? [])]

  for (let page = 2; page <= (firstPage.data?.meta?.pages ?? 1); page += 1) {
    const response = await bookmarkApi.getSavedCompanies({
      page,
      size: SAVED_STATE_PAGE_SIZE,
    })
    allSavedCompanies.push(...(response.data?.result ?? []))
  }

  return allSavedCompanies
}

export const useSavedJobs = (params: IBookmarkPageReq) => {
  const { data: session, status } = useSession()
  const userId = session?.user?.id
  const enabled = status === "authenticated" && !!userId && isCandidateRole(session.user?.role)

  return CustomHooks.useQuery<IApiResponse<ISavedJobPage>>(
    bookmarkKeys.jobList(userId ?? "anonymous", params),
    () => bookmarkApi.getSavedJobs(params),
    { enabled, placeholderData: undefined },
  )
}

export const useSavedCompanies = (params: IBookmarkPageReq) => {
  const { data: session, status } = useSession()
  const userId = session?.user?.id
  const enabled = status === "authenticated" && !!userId && isCandidateRole(session.user?.role)

  return CustomHooks.useQuery<IApiResponse<ISavedCompanyPage>>(
    bookmarkKeys.companyList(userId ?? "anonymous", params),
    () => bookmarkApi.getSavedCompanies(params),
    { enabled, placeholderData: undefined },
  )
}

export type BookmarkKind = "job" | "company"

export interface IBookmarkToggleVariables {
  resourceId: number
  savedRecord?: ISavedJob | ISavedCompany
}

export const useSavedItemIndex = (kind: BookmarkKind, enabled = true) => {
  const { data: session, status } = useSession()
  const userId = session?.user?.id
  const shouldFetch = enabled && status === "authenticated" && !!userId && isCandidateRole(session.user?.role)

  return CustomHooks.useQuery<ISavedJob[] | ISavedCompany[]>(
    kind === "job"
      ? bookmarkKeys.jobIndex(userId ?? "anonymous")
      : bookmarkKeys.companyIndex(userId ?? "anonymous"),
    () => kind === "job" ? getAllSavedJobs() : getAllSavedCompanies(),
    { enabled: shouldFetch, staleTime: 30_000, placeholderData: undefined },
  )
}

export const useToggleSavedItem = (kind: BookmarkKind) => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const userId = session?.user?.id

  return CustomHooks.useMutation<
    IApiResponse<ISavedJob> | IApiResponse<ISavedCompany> | IApiResponse<void>,
    unknown,
    IBookmarkToggleVariables
  >(
    ({ resourceId, savedRecord }) => {
      if (kind === "job") {
        return savedRecord
          ? bookmarkApi.unsaveJob(savedRecord.id)
          : bookmarkApi.saveJob(resourceId)
      }
      return savedRecord
        ? bookmarkApi.unsaveCompany(savedRecord.id)
        : bookmarkApi.saveCompany(resourceId)
    },
    {
      onSuccess: (response, variables) => {
        if (!userId) return
        if (kind === "job") {
          const key = bookmarkKeys.jobIndex(userId)
          if (variables.savedRecord) {
            queryClient.setQueryData<ISavedJob[]>(key, (current) =>
              current?.filter((saved) => saved.id !== variables.savedRecord?.id),
            )
          } else {
            const savedJob = (response as IApiResponse<ISavedJob>).data
            if (savedJob) {
              queryClient.setQueryData<ISavedJob[]>(key, (current) =>
                current?.some((saved) => saved.job.id === savedJob.job.id)
                  ? current
                  : current ? [...current, savedJob] : current,
              )
            }
          }
          queryClient.invalidateQueries({ queryKey: [...bookmarkKeys.jobs(userId), "list"] })
          return
        }

        const key = bookmarkKeys.companyIndex(userId)
        if (variables.savedRecord) {
          queryClient.setQueryData<ISavedCompany[]>(key, (current) =>
            current?.filter((saved) => saved.id !== variables.savedRecord?.id),
          )
        } else {
          const savedCompany = (response as IApiResponse<ISavedCompany>).data
          if (savedCompany) {
            queryClient.setQueryData<ISavedCompany[]>(key, (current) =>
              current?.some((saved) => saved.company.id === savedCompany.company.id)
                ? current
                : current ? [...current, savedCompany] : current,
            )
          }
        }
        queryClient.invalidateQueries({ queryKey: [...bookmarkKeys.companies(userId), "list"] })
      },
    },
  )
}

