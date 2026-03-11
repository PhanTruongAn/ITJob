"use client"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material"

export default function JobFiltersSidebar() {
  return (
    <Stack spacing={4} sx={{ width: { xs: "100%", lg: 280 } }}>
      {/* Skills */}
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "common.white",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography fontWeight="bold">Bộ lọc</Typography>
          <Button size="small" variant="text" color="primary">
            Xóa tất cả
          </Button>
        </Stack>

        <Box mb={3}>
          <Typography fontWeight="bold" mb={1}>
            Kỹ năng
          </Typography>
          <Stack spacing={1}>
            {["JavaScript", "React Native", "Python", "Swift"].map((skill) => (
              <FormControlLabel
                key={skill}
                control={<Checkbox />}
                label={skill}
              />
            ))}
          </Stack>
        </Box>

        <Box mb={3}>
          <Typography fontWeight="bold" mb={1}>
            Mức lương
          </Typography>
          <RadioGroup>
            {[
              "Dưới $1,000",
              "$1,000 - $2,500",
              "Trên $2,500",
              "Thỏa thuận",
            ].map((s) => (
              <FormControlLabel
                key={s}
                value={s}
                control={<Radio />}
                label={s}
              />
            ))}
          </RadioGroup>
        </Box>

        <Box mb={3}>
          <Typography fontWeight="bold" mb={1}>
            Loại hình
          </Typography>
          <Stack spacing={1}>
            {["Full-time", "Remote", "Hybrid"].map((type) => (
              <FormControlLabel
                key={type}
                control={<Checkbox />}
                label={type}
              />
            ))}
          </Stack>
        </Box>

        <Box mb={3}>
          <Typography fontWeight="bold" mb={1}>
            Cấp bậc
          </Typography>
          <Stack spacing={1}>
            {["Fresher / Junior", "Senior", "Manager"].map((level) => (
              <FormControlLabel
                key={level}
                control={<Checkbox />}
                label={level}
              />
            ))}
          </Stack>
        </Box>

        {/* Subscription */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "primary.light",
            color: "primary.main",
          }}
        >
          <Typography fontWeight="bold" mb={1}>
            Nhận thông báo việc làm
          </Typography>
          <Typography variant="body2" mb={2}>
            Chúng tôi sẽ gửi các việc làm phù hợp nhất vào email của bạn.
          </Typography>
          <TextField
            fullWidth
            placeholder="Email của bạn"
            size="small"
            sx={{
              mb: 2,
            }}
          />
          <Button fullWidth variant="contained" color="primary">
            Đăng ký ngay
          </Button>
        </Box>
      </Box>
    </Stack>
  )
}
