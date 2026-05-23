"use client"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Rating from "@mui/material/Rating"
import LinearProgress from "@mui/material/LinearProgress"
import Button from "@mui/material/Button"
import RateReviewIcon from "@mui/icons-material/RateReview"
import Avatar from "@mui/material/Avatar"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import StarIcon from "@mui/icons-material/Star"
import StarHalfIcon from "@mui/icons-material/StarHalf"
import { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"

interface Review {
  id: number
  author: string
  avatar: string
  avatarBg?: string
  date: string
  rating: number
  title: string
  pros?: string
  cons?: string
  comment?: string
}

const initialReviews: Review[] = [
  {
    id: 1,
    author: "Ẩn danh",
    avatar: "A",
    avatarBg: "grey.400",
    date: "Đã đăng vào 12 tháng 10, 2023",
    rating: 5,
    title: "Môi trường làm việc chuyên nghiệp, cơ hội phát triển tốt",
    pros: "Quy trình làm việc bài bản, được tham gia vào các dự án lớn với khách hàng quốc tế. Đồng nghiệp thân thiện và sẵn sàng hỗ trợ. Chế độ bảo hiểm và phúc lợi đầy đủ.",
    cons: "Áp lực công việc đôi khi khá cao vào giai đoạn release dự án.",
  },
  {
    id: 2,
    author: "Nguyễn Văn Nam",
    avatar: "N",
    avatarBg: "primary.light",
    date: "Đã đăng vào 05 tháng 08, 2023",
    rating: 4,
    title: "Nơi tốt để bắt đầu sự nghiệp cho Fresher",
    comment: "Chương trình đào tạo bài bản cho sinh viên mới ra trường. Có nhiều câu lạc bộ và hoạt động ngoại khóa. Văn phòng hiện đại và đẹp.",
  },
]

export default function CompanyReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [open, setOpen] = useState(false)
  const [newReview, setNewReview] = useState({
    author: "",
    rating: 5,
    title: "",
    pros: "",
    cons: "",
    comment: "",
  })

  // Calculate statistics
  const totalReviews = reviews.length
  const averageRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (totalReviews || 1)
  ).toFixed(1)

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r) => {
    const key = Math.round(r.rating) as 5 | 4 | 3 | 2 | 1
    if (ratingCounts[key] !== undefined) {
      ratingCounts[key]++
    }
  })

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0
  }

  const handleOpenDialog = () => {
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  const handleSubmitReview = () => {
    if (!newReview.title) return

    const reviewToAdd: Review = {
      id: Date.now(),
      author: newReview.author || "Ẩn danh",
      avatar: (newReview.author || "A").trim().charAt(0).toUpperCase(),
      avatarBg: newReview.author ? "primary.light" : "grey.400",
      date: `Đã đăng vào ${new Date().toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}`,
      rating: newReview.rating,
      title: newReview.title,
      pros: newReview.pros || undefined,
      cons: newReview.cons || undefined,
      comment: newReview.comment || undefined,
    }

    setReviews([reviewToAdd, ...reviews])
    setNewReview({
      author: "",
      rating: 5,
      title: "",
      pros: "",
      cons: "",
      comment: "",
    })
    setOpen(false)
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
              {averageRating}
            </Typography>
            <Rating
              value={parseFloat(averageRating)}
              precision={0.1}
              readOnly
              emptyIcon={<StarIcon style={{ opacity: 0.25 }} fontSize="inherit" />}
              sx={{ color: "#facc15", mt: 1 }}
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              {totalReviews} đánh giá
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* Breakdown bars */}
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            {([5, 4, 3, 2, 1] as const).map((star) => (
              <Box key={star} display="flex" alignItems="center" gap={2}>
                <Typography variant="caption" fontWeight="bold" sx={{ width: 12 }}>
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
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 24, textAlign: "right" }}>
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
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: review.avatarBg || "primary.main",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {review.avatar}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                    {review.author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {review.date}
                  </Typography>
                </Box>
              </Box>
              <Rating value={review.rating} readOnly sx={{ color: "#facc15" }} size="small" />
            </Box>

            {/* Title & Comments */}
            <Stack spacing={1.5}>
              <Typography variant="body1" fontWeight="bold" color="text.primary">
                {review.title}
              </Typography>

              {review.pros && (
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  <Box component="strong" sx={{ color: "primary.main", mr: 1 }}>
                    Ưu điểm:
                  </Box>
                  {review.pros}
                </Typography>
              )}

              {review.cons && (
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  <Box component="strong" sx={{ color: "error.main", mr: 1 }}>
                    Nhược điểm:
                  </Box>
                  {review.cons}
                </Typography>
              )}

              {review.comment && (
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {review.comment}
                </Typography>
              )}
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Write Review Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: "bold" }}>Viết đánh giá công ty</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="body2" fontWeight="bold" color="text.secondary" gutterBottom>
                Đánh giá tổng quan
              </Typography>
              <Rating
                value={newReview.rating}
                onChange={(_, val) => setNewReview({ ...newReview, rating: val || 5 })}
                sx={{ color: "#facc15" }}
                size="large"
              />
            </Box>
            <TextField
              label="Họ và tên (Để trống để đăng ẩn danh)"
              fullWidth
              size="small"
              value={newReview.author}
              onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
            />
            <TextField
              label="Tiêu đề đánh giá"
              fullWidth
              required
              size="small"
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
            />
            <TextField
              label="Ưu điểm"
              fullWidth
              multiline
              rows={2}
              size="small"
              value={newReview.pros}
              onChange={(e) => setNewReview({ ...newReview, pros: e.target.value })}
            />
            <TextField
              label="Nhược điểm"
              fullWidth
              multiline
              rows={2}
              size="small"
              value={newReview.cons}
              onChange={(e) => setNewReview({ ...newReview, cons: e.target.value })}
            />
            <TextField
              label="Ý kiến khác"
              fullWidth
              multiline
              rows={3}
              size="small"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
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
            disabled={!newReview.title}
          >
            Đăng đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
