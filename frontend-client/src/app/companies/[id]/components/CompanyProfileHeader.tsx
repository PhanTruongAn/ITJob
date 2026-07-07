"use client"
import BusinessIcon from "@mui/icons-material/Business"
import GroupsIcon from "@mui/icons-material/Groups"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import StarIcon from "@mui/icons-material/Star"
import VerifiedIcon from "@mui/icons-material/Verified"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Rating from "@mui/material/Rating"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { COMPANY_TYPE_LABEL } from "../../constants"

interface CompanyProfileHeaderProps {
  name: string
  logo: string
  tagline: string
  location: string
  industry: string
  employeeCount: string
  rating?: number
  reviews?: number
  badge?: string
  isVerified?: boolean
  isFollowing?: boolean
  isFollowingLoading?: boolean
  onFollow?: () => void
  onVisitWebsite?: () => void
}

export default function CompanyProfileHeader({
  name,
  logo,
  tagline,
  location,
  industry,
  employeeCount,
  rating,
  reviews,
  badge,
  isVerified = false,
  isFollowing = false,
  isFollowingLoading = false,
  onFollow,
  onVisitWebsite,
}: CompanyProfileHeaderProps) {
  return (
    <Container
      maxWidth="lg"
      sx={{ mt: "-80px", position: "relative", zIndex: 10 }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          p: { xs: 3, md: 4 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {/* Left: Logo + Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            gap: 3,
            flex: 1,
          }}
        >
          {/* Company Logo */}
          <Paper
            elevation={2}
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "common.white",
              mt: { xs: "-60px", md: "-80px" },
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo || "/placeholder-logo.png"}
              alt={`${name} logo`}
              style={{
                width: 96,
                height: 96,
                objectFit: "contain",
                display: "block",
              }}
            />
          </Paper>

          {/* Company Info */}
          <Box sx={{ flex: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              gap={1}
              mb={0.5}
              flexWrap="wrap"
            >
              <Typography
                variant="h4"
                component="h1"
                fontWeight="800"
                sx={{
                  color: "primary.main",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                {name}
              </Typography>
              {isVerified && (
                <VerifiedIcon sx={{ color: "#1976d2", fontSize: 24 }} />
              )}
              {badge && (
                <Chip
                  label={badge}
                  size="small"
                  sx={{
                    bgcolor: "warning.main",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.7rem",
                    height: 22,
                  }}
                />
              )}
            </Stack>

            <Typography
              variant="body1"
              color="text.secondary"
              fontWeight={500}
              mb={1.5}
            >
              {tagline}
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
              {location && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <LocationOnIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {location}
                  </Typography>
                </Stack>
              )}
              {industry && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <BusinessIcon
                    sx={{ fontSize: 18, color: "text.secondary" }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {COMPANY_TYPE_LABEL[industry]}
                  </Typography>
                </Stack>
              )}
              {employeeCount && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <GroupsIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {employeeCount}
                  </Typography>
                </Stack>
              )}
              {(rating !== undefined || reviews !== undefined) && (
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <Rating
                    value={rating ?? 0}
                    precision={0.1}
                    readOnly
                    size="small"
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.25 }} fontSize="inherit" />
                    }
                    sx={{ color: "#facc15" }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {rating?.toFixed(1)} ({reviews ?? 0} đánh giá)
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Box>
        </Box>

        <Stack
          direction={{ xs: "row", md: "row" }}
          gap={1.5}
          flexShrink={0}
          width={{ xs: "100%", md: "auto" }}
        >
          <Button
            variant={isFollowing ? "outlined" : "contained"}
            color="primary"
            disabled={isFollowingLoading}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2,
              flex: { xs: 1, md: "none" },
            }}
            onClick={onFollow}
          >
            {isFollowingLoading ? "..." : isFollowing ? "Following" : "Follow"}
          </Button>
          {onVisitWebsite && (
            <Button
              variant="outlined"
              color="primary"
              sx={{
                px: 3,
                py: 1.2,
                fontWeight: "bold",
                borderRadius: 2,
                flex: { xs: 1, md: "none" },
              }}
              onClick={onVisitWebsite}
            >
              Visit Website
            </Button>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}
