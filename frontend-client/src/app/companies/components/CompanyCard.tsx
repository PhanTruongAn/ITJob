"use client"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import StarIcon from "@mui/icons-material/Star"
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material"

interface CompanyCardProps {
  id: number
  name: string
  logo: string
  industry: string
  rating: number
  reviews: number
  description: string
  jobCount: number
  badge?: "Hot" | "Top Rated"
}

export default function CompanyCard({
  name,
  logo,
  industry,
  rating,
  reviews,
  description,
  jobCount,
  badge,
}: CompanyCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        boxShadow: "none",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 8,
          "& .company-title": {
            color: "primary.main",
          },
        },
      }}
    >
      {/* Header section with background and Overlapped Logo */}
      <Box
        sx={{
          height: 160,
          position: "relative",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.800" : "grey.100",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom right, rgba(0, 43, 92, 0.05), transparent)",
          }}
        />
        {/* The Overlapped Logo Center */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 96,
            height: 96,
            bgcolor: "common.white",
            borderRadius: 3,
            boxShadow: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            p: 1.5,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt={`${name} logo`}
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </Box>
      </Box>

      {/* Content section */}
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography
            variant="h6"
            component="h3"
            fontWeight="bold"
            className="company-title"
            sx={{ transition: "color 0.2s" }}
          >
            {name}
          </Typography>
          {badge && (
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: "bold",
                bgcolor: badge === "Hot" ? "success.light" : "primary.light",
                color: badge === "Hot" ? "success.dark" : "primary.main",
                opacity: 0.9,
              }}
            >
              {badge}
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="primary.main" fontWeight={500} mb={1.5}>
          {industry}
        </Typography>

        <Box display="flex" alignItems="center" gap={0.5} mb={2}>
          <StarIcon sx={{ color: "warning.main", fontSize: 18 }} />
          <Typography variant="body2" fontWeight="bold">
            {rating}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({reviews.toLocaleString()} đánh giá)
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 2,
            height: 40,
          }}
        >
          {description}
        </Typography>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          pt={2}
          borderTop="1px solid"
          borderColor="divider"
        >
          <Typography variant="body2" color="primary.main" fontWeight="bold">
            {jobCount} việc làm đang tuyển
          </Typography>
          <IconButton
            size="small"
            color="inherit"
            sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
            aria-label="View jobs"
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}
