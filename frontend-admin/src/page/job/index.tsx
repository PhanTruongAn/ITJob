import { message, theme } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { createJob, deleteJob, editJob, fetchJobs } from "../../apis/jobModule"
import { fetchSkills } from "../../apis/skillModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../common/queryKeys"
import ConfirmModal from "../../components/modal/ConfirmModal"
import CustomGlobalTable from "../../components/table"
import { IBackendPaginateRes, ISkill } from "../../types/backend"
import { DEFAULT_STATE } from "./common/constants"
import { useGetCompanyList, useJobState } from "./common/hooks"
import type { Job, JobFilter } from "./common/interfaces"
import CreateJobModal from "./components/create/CreateJobModal"
import EditJobModal from "./components/edit/EditJobModal"
import JobListHeader from "./components/JobListHeader"
import { JobListHeaderToolbar } from "./components/JobListToolBar"
import { JobColumns } from "./components/table/JobColumns"

const JobManageList: React.FC = () => {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const { state, updateState } = useJobState()
  const listStyle: React.CSSProperties = {
    display: "flex",
    background: token.colorBgContainer,
    borderRadius: token.borderRadiusLG,
    marginTop: 13,
    flexDirection: "column",
  }

  const [visibleCreateModal, setVisibleCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [visibleEditModal, setVisibleEditModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | undefined>(undefined)

  const [visibleDeleteModal, setVisibleDeleteModal] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    data: companyResponse,
    isLoading: isLoadingCompanyOptions,
    isError: isCompanyOptionsError,
    refetch: refetchCompanyOptions,
  } = useGetCompanyList()
  const companiesOptions = companyResponse?.data?.result ?? []
  const companyOptionsError =
    isCompanyOptionsError || (companyResponse?.statusCode ?? 200) >= 400

  const [skillsOptions, setSkillsOptions] = useState<ISkill[]>([])

  useEffect(() => {
    const loadOptions = async () => {
      const skillRes = await fetchSkills({ page: 1, pageSize: 100 })
      if (skillRes?.data?.result) setSkillsOptions(skillRes.data.result)
    }
    loadOptions()
  }, [])

  const fetchLitsJob = async (): Promise<IBackendPaginateRes<Job[]>> => {
    const res = await fetchJobs({
      page: state.page,
      pageSize: state.pageSize,
      sort: state.sort,
      name: state.name || null,
      companyId: state.companyId || null,
      level: state.level || null,
      location: state.location || null,
      maxSalary: state.maxSalary || null,
      minSalary: state.minSalary || null,
      skillId: state.skillId || null,
    })
    if (res?.statusCode >= 400) {
      message.error(res?.message)
    } else {
      updateState({ total: res.data.meta.total })
    }
    return res
  }

  const {
    data,
    refetch,
    isFetching: isFetchingJob,
  } = CustomHooks.useQuery<IBackendPaginateRes<Job[]>>(
    [
      QUERY_KEYS.JOB_MODULE,
      state.page,
      state.pageSize,
      state.sort,
      state.name,
      state.companyId,
      state.level,
      state.location,
      state.maxSalary,
      state.minSalary,
      state.skillId,
    ],
    fetchLitsJob,
  )

  const handlerFilterJobs = ({
    companyId,
    level,
    location,
    maxSalary,
    minSalary,
    name,
    skillId,
  }: JobFilter) => {
    updateState({
      page: 1,
      companyId,
      level,
      location,
      maxSalary,
      minSalary,
      name,
      skillId,
    })
  }

  const handlerClearFilter = () => {
    updateState(DEFAULT_STATE)
  }

  const handleTableChange = (page: number, pageSize: number, sort?: string) => {
    updateState({ page: sort !== state.sort ? 1 : page, pageSize, sort })
  }

  const handleCreate = async (values: any) => {
    setIsCreating(true)
    try {
      const res = await createJob(values)
      if (res.statusCode >= 400) {
        message.error(res.message)
        return
      }

      message.success("Job created successfully")
      setVisibleCreateModal(false)
      refetch()
    } catch (error) {
      // The shared Axios interceptor already displays authorization failures.
      if (!(axios.isAxiosError(error) && error.response?.status === 403)) {
        message.error(
          axios.isAxiosError(error)
            ? error.response?.data?.message || "Unable to create job"
            : "Unable to create job",
        )
      }
    } finally {
      setIsCreating(false)
    }
  }

  const handleEdit = async (values: any) => {
    setIsEditing(true)
    const res = await editJob(values)
    setIsEditing(false)
    if (res.statusCode >= 400) {
      message.error(res.message)
    } else {
      message.success("Job updated successfully")
      setVisibleEditModal(false)
      setSelectedJob(undefined)
      refetch()
    }
  }

  const handleDelete = async () => {
    if (!selectedJobId || isDeleting) return

    setIsDeleting(true)
    try {
      const res = await deleteJob({ id: selectedJobId })
      if (res.statusCode >= 400) {
        message.error(res.message)
        return
      }

      message.success("Deleted successfully")
      void refetch()
    } catch (error) {
      // The shared Axios interceptor already reports forbidden responses.
      if (!(axios.isAxiosError(error) && error.response?.status === 403)) {
        message.error(
          axios.isAxiosError(error)
            ? error.response?.data?.message || "Unable to delete job"
            : "Unable to delete job",
        )
      }
    } finally {
      setIsDeleting(false)
      setVisibleDeleteModal(false)
      setSelectedJobId(null)
    }
  }

  const handleViewJob = (record: Job) => {
    // Optionally navigate to a read-only page or pop up modal
    // For now, let's just open the edit modal in view mode? Or just view mode.
    // The previous stub was empty.
    setSelectedJob(record)
    setVisibleEditModal(true)
  }

  return (
    <>
      <JobListHeader
        onAddJob={() => setVisibleCreateModal(true)}
        onRefresh={() => refetch()}
        loading={isFetchingJob}
      />
      <JobListHeaderToolbar
        onClear={handlerClearFilter}
        onFilter={handlerFilterJobs}
      />

      <CreateJobModal
        loading={isCreating}
        open={visibleCreateModal}
        companyOptions={companiesOptions}
        companyOptionsLoading={isLoadingCompanyOptions}
        companyOptionsError={companyOptionsError}
        onRetryCompanyOptions={() => void refetchCompanyOptions()}
        skillOptions={skillsOptions}
        onCancel={() => setVisibleCreateModal(false)}
        onSubmit={handleCreate}
      />

      <EditJobModal
        loading={isEditing}
        open={visibleEditModal}
        record={selectedJob}
        companyOptions={companiesOptions}
        skillOptions={skillsOptions}
        onCancel={() => {
          setVisibleEditModal(false)
          setSelectedJob(undefined)
        }}
        onSubmit={handleEdit}
      />

      <ConfirmModal
        content="Are you sure you want to delete this job?"
        visible={visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDeleting}
        onCancel={() => setVisibleDeleteModal(false)}
        title="Confirm job deletion"
      />

      <div style={listStyle}>
        <div className="table-container" style={{ padding: 16 }}>
          <CustomGlobalTable<Job>
            columns={JobColumns({
              onView: (record) => {
                handleViewJob(record)
              },
              onEdit: (record) => {
                setSelectedJob(record)
                setVisibleEditModal(true)
              },
              onDelete: (record) => {
                setSelectedJobId(record)
                setVisibleDeleteModal(true)
              },
            })}
            data={data?.data?.result || []}
            loading={isFetchingJob}
            total={data?.data?.meta?.total || 0}
            page={state.page}
            pageSize={state.pageSize}
            onTableChange={handleTableChange}
          />
        </div>
      </div>
    </>
  )
}

export default JobManageList
