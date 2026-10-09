"use client"
import {
  useCompanyReviews,
  useCompanyReviewSummary,
  useCreateReview,
} from "@/apis/review/review.hooks"
import { getRequestErrorMessage } from "@/common/security/frontendSecurity.mjs"
import { useUpdateState } from "@/common/hooks/useUpdateState"
import RateReviewIcon from "@mui/icons-material/RateReview"
import StarIcon from "@mui/icons-material/Star"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import CircularProgress from "@mui/material/CircularProgress"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Divider from "@mui/material/Divider"
import LinearProgress from "@mui/material/LinearProgress"
import Pagination from "@mui/material/Pagination"
import Rating from "@mui/material/Rating"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useTranslation } from "react-i18next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface CompanyReviewsTabProps {
  companyId: number
}

interface ReviewState {
  page: number
  open: boolean
  rating: number
  comment: string
}

export default function CompanyReviewsTab({
  companyId,
}: CompanyReviewsTabProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useTranslation()

  const { state, updateState } = useUpdateState<ReviewState>({
    page: 1,
    open: false,
    rating: 5,
    comment: "",
  })

  // Fetch reviews using react query
  const pageSize = 10
  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    isFetching: isReviewsFetching,
    isError: isReviewsError,
    refetch: refetchReviews,
  } = useCompanyReviews(
    companyId,
    state.page,
    pageSize,
  )
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useCompanyReviewSummary(companyId)
  const createReviewMutation = useCreateReview()

  const reviews = reviewsData?.data?.result || []
  const meta = reviewsData?.data?.meta
  const summary = summaryData?.data
  const totalReviewsCount = summary?.totalReviews ?? 0
  const ratingCounts = {
    5: summary?.fiveStarCount ?? 0,
    4: summary?.fourStarCount ?? 0,
    3: summary?.threeStarCount ?? 0,
    2: summary?.twoStarCount ?? 0,
    1: summary?.oneStarCount ?? 0,
  }
  const isLoading =
    isReviewsLoading || isReviewsFetching || isSummaryLoading || isSummaryFetching
  const isError = isReviewsError || isSummaryError

  const getPercentage = (count: number) => {
    return totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0
  }

  const handleOpenDialog = () => {
    if (status !== "authenticated") {
      alert("Vui lòng đăng nhập để viết đánh giá!")
      router.push("/signin")
      return
    }
    updateState({ open: true })
  }

  const handleCloseDialog = () => {
    updateState({ open: false, rating: 5, comment: "" })
  }

  const handleSubmitReview = () => {
    if (!state.comment.trim() || status !== "authenticated") return

    createReviewMutation.mutate(
      {
        companyId,
        rating: state.rating,
        comment: state.comment,
      },
      {
        onSuccess: (res) => {
          if (res?.statusCode >= 400) {
            alert(res.message || "Không thể đăng đánh giá.")
          } else {
            handleCloseDialog()
          }
        },
        onError: (error: any) => {
          alert(getRequestErrorMessage(error, {
            forbidden: "Tài khoản hiện tại không có quyền đăng đánh giá.",
            fallback: "Có lỗi xảy ra khi gửi đánh giá.",
          }))
        },
      },
    )
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    updateState({ page: value })
  }

  const handleRetry = () => {
    void refetchReviews()
    void refetchSummary()
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress aria-label={t("companyReviews.loading")} />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={handleRetry}>
            {t("companyReviews.retry")}
          </Button>
        }
      >
        {t("companyReviews.loadError")}
      </Alert>
    )
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Review Summary Panel */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          gap: 4,
          p: 3,
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.03)"
              : "grey.50",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center" gap={4} sx={{ flexGrow: 1 }}>
          {/* Average Rating */}
          <Box sx={{ textAlign: "center", minWidth: 100 }}>
            <Typography variant="h3" fontWeight="800" color="text.primary">
              {summary?.averageRating != null
                ? summary.averageRating.toFixed(1)
                : t("companyReviews.notRated")}
            </Typography>
            {summary?.averageRating != null && (
              <Rating
                value={summary.averageRating}
                precision={0.1}
                readOnly
                emptyIcon={
                  <StarIcon style={{ opacity: 0.25 }} fontSize="inherit" />
                }
                sx={{ color: "#facc15", mt: 1 }}
              />
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mt: 1 }}
            >
              {t("companyReviews.reviewCount", { count: totalReviewsCount })}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Breakdown bars */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <Box key={star} display="flex" alignItems="center" gap={2}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  sx={{ width: 12 }}
                >
                  {star}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={getPercentage(ratingCounts[star])}
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "grey.800" : "grey.200",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#facc15",
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ minWidth: 24, textAlign: "right" }}
                >
                  {ratingCounts[star]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>

        {/* Action Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<RateReviewIcon />}
          onClick={handleOpenDialog}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            borderRadius: 2.5,
            whiteSpace: "nowrap",
            boxShadow: 2,
            textTransform: "none",
            "&:hover": {
              opacity: 0.9,
            },
          }}
        >
          Viết đánh giá
        </Button>
      </Box>

      {/* Reviews List */}
      {totalReviewsCount === 0 ? (
        <Box
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {t("companyReviews.noReviews")}
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {reviews.map((review) => (
            <Box
              key={review.id}
              sx={{
                p: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                boxShadow: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              {/* Header info */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.light",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {review.userName
                      ? review.userName.charAt(0).toUpperCase()
                      : "A"}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      color="text.primary"
                    >
                      {review.userName || "Ẩn danh"}
                    </Typography>
                  </Box>
                </Box>
                <Rating
                  value={review.rating}
                  readOnly
                  sx={{ color: "#facc15" }}
                  size="small"
                />
              </Box>

              {/* Comments */}
              <Stack spacing={1.5}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                  }}
                >
                  {review.comment}
                </Typography>
              </Stack>
            </Box>
          ))}

          {/* Pagination */}
          {meta && meta.pages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={meta.pages}
                page={state.page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </Stack>
      )}

      {/* Write Review Dialog */}
      <Dialog
        open={state.open}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Viết đánh giá công ty
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
                gutterBottom
              >
                Đánh giá tổng quan
              </Typography>
              <Rating
                value={state.rating}
                onChange={(_, val) => updateState({ rating: val || 5 })}
                sx={{ color: "#facc15" }}
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              required
              multiline
              minRows={4}
              maxRows={8}
              InputLabelProps={{ shrink: true }}
              value={state.comment}
              onChange={(e) => updateState({ comment: e.target.value })}
              placeholder="Chia sẻ trải nghiệm làm việc của bạn tại công ty này..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            color="primary"
            disabled={!state.comment.trim() || createReviewMutation.isPending}
          >
            {createReviewMutation.isPending ? "Đang gửi..." : "Đăng đánh giá"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
