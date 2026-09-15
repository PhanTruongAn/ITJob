import { Modal, Tag, Typography, message, theme } from "antd"
import React, { useState } from "react"
import { fetchReviews } from "../../apis/reviewModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import useRefresh from "../../common/hooks/useRefresh"
import { QUERY_KEYS } from "../../common/queryKeys"
import ConfirmModal from "../../components/modal/ConfirmModal"
import CustomGlobalTable from "../../components/table"
import { IBackendPaginateRes, ICompanyReview } from "../../types/backend"
import { useDeleteReview, useReviewState, useUpdateReview } from "./common/hooks"
import ReviewListHeader from "./components/ReviewListHeader"
import { reviewColumns } from "./components/table/ReviewColumns"

const ReviewManageList: React.FC = () => {
  const { token } = theme.useToken()
  const { state, updateState } = useReviewState()

  const [selectedReview, setSelectedReview] = useState<ICompanyReview | null>(null)
  const [visibleDetailModal, setVisibleDetailModal] = useState(false)

  const fetchDataReviews = async (): Promise<
    IBackendPaginateRes<ICompanyReview[]>
  > => {
    const res = await fetchReviews({
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
  const { mutate: updateMutate } = useUpdateReview()

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

  const handleToggleHide = (record: ICompanyReview) => {
    updateMutate(
      {
        id: record.id,
        hidden: !record.hidden,
      },
      {
        onSuccess: (res) => {
          if (res?.statusCode >= 400) {
            message.error(res?.message)
          } else {
            refetch()
          }
        },
      }
    )
  }

  const handleViewDetail = (record: ICompanyReview) => {
    setSelectedReview(record)
    setVisibleDetailModal(true)
  }

  return (
    <div className="container">
      <ReviewListHeader onRefresh={handleRefresh} loading={isLoading} />

      <ConfirmModal
        content="Bạn có chắc chắn muốn xóa đánh giá này?"
        visible={state.visibleDeleteModal}
        type="warning"
        onOk={handleDelete}
        loading={isDeleting}
        onCancel={() => updateState({ visibleDeleteModal: false })}
        title="Xác nhận xóa đánh giá"
      />

      <Modal
        title="Chi tiết Đánh giá Công ty"
        open={visibleDetailModal}
        onCancel={() => setVisibleDetailModal(false)}
        footer={null}
        width={600}
      >
        {selectedReview && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            <div>
              <Typography.Text type="secondary">ID Đánh giá: </Typography.Text>
              <Typography.Text strong>{selectedReview.id}</Typography.Text>
            </div>
            <div>
              <Typography.Text type="secondary">Công ty: </Typography.Text>
              <Typography.Text strong>
                {selectedReview.companyName} (ID: {selectedReview.companyId})
              </Typography.Text>
            </div>
            <div>
              <Typography.Text type="secondary">Người đánh giá: </Typography.Text>
              <Typography.Text strong>{selectedReview.userName || "Ẩn danh"}</Typography.Text>
            </div>
            <div>
              <Typography.Text type="secondary">Đánh giá: </Typography.Text>
              <Tag color="gold" style={{ fontWeight: 600 }}>
                ⭐ {selectedReview.rating} sao
              </Tag>
            </div>
            <div>
              <Typography.Text type="secondary">Trạng thái: </Typography.Text>
              {selectedReview.hidden ? (
                <Tag color="red">Đã ẩn</Tag>
              ) : (
                <Tag color="green">Hiển thị</Tag>
              )}
            </div>
            <div>
              <Typography.Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                Nội dung comment:
              </Typography.Text>
              <div
                style={{
                  background: "#f5f5f5",
                  padding: 12,
                  borderRadius: 6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: 1.6,
                }}
              >
                {selectedReview.comment || selectedReview.content || "(Không có nội dung)"}
              </div>
            </div>
          </div>
        )}
      </Modal>

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
            onToggleHide: handleToggleHide,
            onViewDetail: handleViewDetail,
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

