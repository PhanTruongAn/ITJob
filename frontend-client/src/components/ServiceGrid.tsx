"use client"
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined"
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid2"
import Typography from "@mui/material/Typography"

const services = [
  {
    title: "Passive Job Search",
    desc: "Nhận lời mời làm việc từ các công ty hàng đầu",
    icon: <WorkOutlineRoundedIcon color="primary" />,
  },
  {
    title: "CV Templates",
    desc: "Tạo CV chuyên nghiệp với hàng chục mẫu chuẩn",
    icon: <DescriptionOutlinedIcon color="primary" />,
  },
  {
    title: "Story Hub",
    desc: "Kết nối cộng đồng IT, học hỏi và phát triển",
    icon: <TipsAndUpdatesOutlinedIcon color="primary" />,
  },
]

export default function ServiceGrid() {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {services.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.title}>
              <Card
                sx={{
                  p: 4,
                  display: "flex",
                  gap: 3,
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-4px)" },
                }}
              >
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: "primary.50" }}>
                  {item.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
                <ArrowForwardIosRoundedIcon
                  sx={{ fontSize: 16, color: "grey.400" }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
