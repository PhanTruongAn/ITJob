import { message, theme } from "antd"
import { useNavigate } from "react-router-dom"
import { fetchJobs } from "../../apis/jobModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../common/queryKeys"
import CustomGlobalTable from "../../components/table"
import { IBackendPaginateRes } from "../../types/backend"
import { DEFAULT_STATE } from "./common/constants"
import { useJobState } from "./common/hooks"
import type { Job, JobFilter } from "./common/interfaces"
import JobListHeader from "./components/JobListHeader"
import { JobListHeaderToolbar } from "./components/JobListToolBar"
import { JobColumns } from "./components/table/JobColumns"

const Job = () => {
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
    // isLoading: isLoadingJob,
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
    fetchLitsJob
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

  const handleViewJob = (record: Job) => {}
  const handleEditJob = (record: Job) => {}
  const confirmDeleteJob = (id: number) => {}
  const handleTableChange = (page: number, pageSize: number, sort?: string) => {
    updateState({ page, pageSize, sort })
  }
  return (
    <>
      <JobListHeader onAddJob={() => {}} onRefresh={() => {}} loading={false} />
      <JobListHeaderToolbar
        onClear={handlerClearFilter}
        onFilter={handlerFilterJobs}
      />
      <div style={listStyle}>
        <div className="table-container">
          <CustomGlobalTable<Job>
            columns={JobColumns({
              onView: (record) => {
                handleViewJob(record)
              },
              onEdit: (record) => {
                handleEditJob(record)
              },
              onDelete: (record) => {
                confirmDeleteJob(record)
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

export default Job
