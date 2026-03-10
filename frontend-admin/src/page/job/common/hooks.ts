import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import {
  createJob,
  deleteJob,
  editJob,
  getJobById,
} from "../../../apis/jobModule"
import { fetchSkillOptions } from "../../../apis/skillModule"
import CustomHooks from "../../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../../common/queryKeys"
import { useUpdateState } from "../../../util/hooks"
import { JobState } from "./interfaces"

export const useJobState = () => {
  const [state, setState] = useState<JobState>({
    page: 1,
    pageSize: 5,
    total: 0,
    sort: undefined,
    loading: false,
    visibleDeleteModal: false,
    visibleEditModal: false,
    typeModal: "view",
  })

  const updateState = useUpdateState<JobState>(setState)

  return { state, updateState }
}

export const useCreateJob = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(createJob, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JOB_MODULE] })
    },
  })
}

export const useDeleteJob = () => {
  return CustomHooks.useMutation(deleteJob)
}

export const useGetJobById = (id: number) => {
  return CustomHooks.useQuery([QUERY_KEYS.JOB_MODULE, id], () => getJobById(id))
}
export const useEditJob = () => {
  const queryClient = useQueryClient()
  return CustomHooks.useMutation(editJob, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JOB_MODULE] })
    },
  })
}
import { fetchCompanies } from "../../../apis/companyModule"

export const useGetCompanyList = () => {
  return CustomHooks.useQuery([QUERY_KEYS.COMPANY_MODULE, "all"], () =>
    fetchCompanies({ page: 1, pageSize: 100 })
  )
}

export const useGetSkillOptions = () => {
  return CustomHooks.useQuery([QUERY_KEYS.SKILL_MODULE], fetchSkillOptions)
}
