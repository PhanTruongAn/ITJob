import { message, theme } from "antd"
import React from "react"
import { fetchResumes } from "../../apis/resumeModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import useRefresh from "../../common/hooks/useRefresh"
import { QUERY_KEYS } from "../../common/queryKeys"
import ConfirmModal from "../../components/modal/ConfirmModal"
import CustomGlobalTable from "../../components/table"
import { IBackendPaginateRes, IResume } from "../../types/backend"
import {
  useApproveResume,
  useDeleteResume,
  useRejectResume,
  useResumeState,
  useReviewResume,
} from "./common/hooks"
import ResumeListHeader from "./components/ResumeListHeader"
import { resumeColumns } from "./components/table/ResumeColumns"

const ResumeManageList: React.FC = () => {
  const { token } = theme.useToken()
  const { state, updateState } = useResumeState()

  const fetchDataResumes = async (): Promise<
    IBackendPaginateRes<IResume[]>
  > => {
    const res = await fetchResumes({
      page: state.page,
      pageSize: state.pageSize,
    })
    if (res?.statusCode >= 400) {
      message.error(res?.message)
    }
    return res
  }

  const {
    data,
    refetch,
    isLoading: isLoadingData,
  } = CustomHooks.useQuery<IBackendPaginateRes<IResume[]>>(
    [QUERY_KEYS.RESUME_MODULE, state.page, state.pageSize],
    fetchDataResumes,
  )

  const { isLoading, handleRefresh } = useRefresh(refetch)

  const handleTableChange = (p: number, ps: number) => {
    updateState({ page: p, pageSize: ps })
  }

  const handleView = (record: IResume) => {
    window.open(record.url, "_blank")
  }

  const { mutate: approveMutate } = useApproveResume()
  const handleApprove = (record: IResume) => {
    message.loading({ content: "Approving...", key: "approve" })
    approveMutate(record.id, {
      onSuccess: () => {
        refetch()
      },
    })
  }

  const { mutate: reviewMutate } = useReviewResume()
  const handleReview = (record: IResume) => {
    message.loading({ content: "Updating status...", key: "review" })
    reviewMutate(record.id, {
      onSuccess: () => {
        refetch()
      },
    })
  }

  const { mutate: rejectMutate } = useRejectResume()
  const handleConfirmReject = () => {
    if (state.selectedId) {
      message.loading({ content: "Rejecting...", key: "reject" })
      rejectMutate(
        { id: state.selectedId, note: state.rejectNote },
        {
          onSuccess: () => {
            refetch()
          },
        },
      )
    }
    updateState({ visibleRejectModal: false, rejectNote: "" })
  }

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteResume()
  const handleDelete = () => {
    if (state.selectedId) {
      deleteMutate(
        { id: state.selectedId },
        {
          onSuccess: (res) => {
            if (res.statusCode >= 400) {
              message.error(res.message)
            } else {
              refetch()
            }
          },
        },
      )
    }
    updateState({ visibleDeleteModal: false, selectedId: null })
  }

  return (
    <div className="container">
      <ResumeListHeader onRefresh={handleRefresh} loading={isLoading} />

      <ConfirmModal
        content="Are you sure you want to delete this resume?"
        visible={state.visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDeleting}
        onCancel={() => updateState({ visibleDeleteModal: false })}
        title="Confirm resume deletion"
      />

      <ConfirmModal
        content={
          <div style={{ marginTop: 16 }}>
            <p>Please provide a reason for rejection (optional):</p>
            <textarea
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 4,
                height: 80,
              }}
              value={state.rejectNote}
              onChange={(e) => updateState({ rejectNote: e.target.value })}
              placeholder="E.g. Candidate does not meet the requirements..."
            />
          </div>
        }
        visible={state.visibleRejectModal}
        type="warning"
        onOk={handleConfirmReject}
        onCancel={() => {
          updateState({ visibleRejectModal: false, rejectNote: "" })
        }}
        title="Reject Resume"
      />

      <div
        style={{
          background: token.colorBgContainer,
          padding: 16,
          marginTop: 16,
        }}
      >
        <CustomGlobalTable<IResume>
          columns={resumeColumns({
            onView: handleView,
            onReview: handleReview,
            onApprove: handleApprove,
            onReject: (record) => {
              updateState({
                selectedId: record.id,
                visibleRejectModal: true,
              })
            },
            onDelete: (record) => {
              updateState({
                selectedId: record.id,
                visibleDeleteModal: true,
              })
            },
          })}
          data={data?.data?.result || []}
          loading={isLoadingData}
          total={data?.data?.meta?.total || 0}
          page={state.page}
          pageSize={state.pageSize}
          onTableChange={handleTableChange}
        />
      </div>
    </div>
  )
}

export default ResumeManageList

