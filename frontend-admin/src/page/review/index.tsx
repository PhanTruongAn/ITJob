import { message, theme } from "antd"
import React from "react"
import { fetchReviews } from "../../apis/reviewModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import useRefresh from "../../common/hooks/useRefresh"
import { QUERY_KEYS } from "../../common/queryKeys"
import ConfirmModal from "../../components/modal/ConfirmModal"
import CustomGlobalTable from "../../components/table"
import { IBackendPaginateRes, ICompanyReview } from "../../types/backend"
import { useDeleteReview, useReviewState } from "./common/hooks"
import ReviewListHeader from "./components/ReviewListHeader"
import { reviewColumns } from "./components/table/ReviewColumns"

const ReviewManageList: React.FC = () => {
  const { token } = theme.useToken()
  const { state, updateState } = useReviewState()

  const fetchDataReviews = async (): Promise<
    IBackendPaginateRes<ICompanyReview[]>
  > => {
    // We pass companyId = 0 basically to fetch all.
    const res = await fetchReviews({
      companyId: 0,
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
  } = CustomHooks.useQuery<IBackendPaginateRes<ICompanyReview[]>>(
    [QUERY_KEYS.REVIEW_MODULE, state.page, state.pageSize],
    fetchDataReviews,
  )

  const { isLoading, handleRefresh } = useRefresh(refetch)

  const handleTableChange = (p: number, ps: number) => {
    updateState({ page: p, pageSize: ps })
  }

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteReview()
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
    updateState({ visibleDeleteModal: false })
  }

  return (
    <div className="container">
      <ReviewListHeader onRefresh={handleRefresh} loading={isLoading} />

      <ConfirmModal
        content="Are you sure you want to delete this review?"
        visible={state.visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDeleting}
        onCancel={() => updateState({ visibleDeleteModal: false })}
        title="Confirm review deletion"
      />
      <div
        style={{
          background: token.colorBgContainer,
          padding: 16,
          marginTop: 16,
        }}
      >
        <CustomGlobalTable<ICompanyReview>
          columns={reviewColumns({
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

export default ReviewManageList

