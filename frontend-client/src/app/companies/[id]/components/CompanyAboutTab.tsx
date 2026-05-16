"use client"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import CloudIcon from "@mui/icons-material/Cloud"
import DataObjectIcon from "@mui/icons-material/DataObject"
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard"
import JavascriptIcon from "@mui/icons-material/Javascript"
import SecurityIcon from "@mui/icons-material/Security"
import TerminalIcon from "@mui/icons-material/Terminal"

const cultureImages = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCogM_dwFvpJgrDTron4sWmIAKkYtWpyn2zfASL4CnmcQb2K1G-Zf4cr2fyk06V79PwP9XXmPCFsQF9sMaEcdWdGrr7PrvitA5OjSJHkNoUKh3Ml0jVJa30NftF1oTCMtRZPEKjKGoj8qJi_79SCzcVQBzTyrfls1Gv8f5-thyK01lNYl2WCvjI597NCPe_xUKTQCID8AeqGtPueYzZPNUdyic6d-bCL-jCwHKlRPYInNm7Mlzh6sbgl5Mtjg2O0_3w9F9To7oSn4w",
    alt: "Team Collaboration",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1RTuG05tSVpSj_n2mwVjNYj7kXa1zOnbthi6l4ClTtCbvaAEangVsemhO7njMNqc_wrMb00rc3oCxjMj9Jc85T-6hUVJB1BtvRWZj3dcAeL1NraLJ0iBQ5gAZz4KyYfcDIS3ceuPvj7NdCNFPKW1TcgI9VGSfsC-LxJbWnF7Vi3q2f1027XRD0c4jYY-laJba2WTVaKqecNnun-AbAvURcqdI5d3F6dTKgucHf0eHt94WUsw-hmeqyPGjXYTDACIOxBxQkp37y0E",
    alt: "Open Office Space",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb40IOyQt4lsYvASC6AFKsGYG4cgoFAUSqQlzqFr5yaWuxmlb9mrtruwVLNsNc5w8lfnTa8RPYf50UAtm18L1ySFPzsEk45HYw6E2ddMjcf_WkIvVlrgTEEgyRa3odAI_UkfSbalgr9UYlGKFs7xuVvm7H22V58y1M4nTQ14fHCkgCXomTmjjs80cameZBnLqEo8Xvo3hoZZYrsn2LTHtxSo8ykRvHrWLFGy5K-vByySx0x20WbD7DBASdnkKoJ14k91dk6BkdkaA",
    alt: "Breakroom & Culture",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJeuvT9x3db85aIcx_gLULBWpZ6DZZH-CnXBw03EMsC6vraW_xRkwuyXXxtH-XZNb4Z2CtFMrh-h1WvktUT8EF8mXg_6ULIDMoZ1fRH_e3gke7y4F_XjFR7--VLNPqQJmXh5umSGcKiAAcm3Wzn57w4_C6Ns8-zmOdnRgEifuEz7WjwqMx3DgoED077hxkHJ1hjh56xZnp8VcUq-DKhS8z7RVYcdkEArYbeWIbfu3lzTtk-2YE96qqBDRebz656k8l6MTVWFsioG4",
    alt: "Tech Presentation",
  },
]

const techStack = [
  { label: "Java / Spring Boot", icon: <TerminalIcon fontSize="small" /> },
  { label: "AWS / Azure", icon: <CloudIcon fontSize="small" /> },
  { label: "Python / AI / ML", icon: <DataObjectIcon fontSize="small" /> },
  { label: "React / Angular", icon: <JavascriptIcon fontSize="small" /> },
  { label: "IoT / Embedded", icon: <DeveloperBoardIcon fontSize="small" /> },
  { label: "Cybersecurity", icon: <SecurityIcon fontSize="small" /> },
]

export default function CompanyAboutTab() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {/* Overview */}
      <Box component="section">
        <Typography
          variant="h6"
          fontWeight="800"
          sx={{ color: "primary.main", mb: 2, fontSize: "1.15rem" }}
        >
          Tổng quan
        </Typography>
        <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
          Được thành lập vào năm 1999, FPT Software là công ty công nghệ và dịch
          vụ CNTT toàn cầu có trụ sở tại Việt Nam. Là một trong những tiên phong
          trong chuyển đổi số, chúng tôi cung cấp các dịch vụ đẳng cấp thế giới
          trong lĩnh vực Nhà máy thông minh, Nền tảng kỹ thuật số, RPA, AI, IoT,
          Cloud, AR/VR và nhiều hơn nữa.
        </Typography>
        <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
          Sứ mệnh của chúng tôi là trao quyền cho các doanh nghiệp trên toàn thế
          giới thông qua các giải pháp công nghệ sáng tạo, thúc đẩy tăng trưởng
          bền vững và xuất sắc trong kỷ nguyên số. Chúng tôi phục vụ hơn 700
          khách hàng toàn cầu, trong đó có 100 công ty trong danh sách Fortune
          Global 500.
        </Typography>
      </Box>

      <Divider />

      {/* Culture & Photos */}
      <Box component="section">
        <Typography
          variant="h6"
          fontWeight="800"
          sx={{ color: "primary.main", mb: 1.5, fontSize: "1.15rem" }}
        >
          Văn hóa công ty
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          lineHeight={1.8}
          mb={3}
        >
          Tại FPT Software, chúng tôi tin vào văn hóa học hỏi liên tục, đổi mới
          và hợp tác toàn cầu. Tinh thần "Work hard, play hard" là động lực cho
          sự thành công của chúng tôi tại 26 quốc gia.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: 2,
          }}
        >
          {cultureImages.map((img) => (
            <Box
              key={img.alt}
              sx={{
                aspectRatio: "1 / 1",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 1,
                "&:hover img": { transform: "scale(1.06)" },
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                  display: "block",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Divider />

      {/* Tech Stack */}
      <Box component="section">
        <Typography
          variant="h6"
          fontWeight="800"
          sx={{ color: "primary.main", mb: 2, fontSize: "1.15rem" }}
        >
          Tech Stack chính
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1.5}>
          {techStack.map((tech) => (
            <Chip
              key={tech.label}
              icon={tech.icon}
              label={tech.label}
              variant="outlined"
              sx={{
                px: 1,
                py: 2.5,
                fontWeight: 600,
                fontSize: "0.85rem",
                borderRadius: 999,
                bgcolor: "background.paper",
                borderColor: "divider",
                boxShadow: 1,
                "& .MuiChip-icon": { color: "primary.main" },
              }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
