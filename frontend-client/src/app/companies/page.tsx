"use client"
import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import AppTheme from "@/shared-theme/AppTheme"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import {
  Box,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  PaginationItem,
  Pagination as MuiPagination,
} from "@mui/material"
import CompanyCard from "./components/CompanyCard"
import CompanyFilters from "./components/CompanyFilters"
import CompanyHero from "./components/CompanyHero"

export default function CompaniesPage() {
  const companies = [
    {
      id: 1,
      name: "FPT Software",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhAt8THPjjqsgqsumgTypz_FO-BsKAV6JaH0cRnHScdCiXCKyR09G_WibSfmRVpcELnt16CQq0JT9lTqKeZ-0cCPrq6Z8Ax_SmuKkdZGVaoq1FBWqwscH1uFASniGiQN8XP1nfZggxz2cc6yqZ90YBEBx_ZpiBkPGFQl-LX-RufgAU57SAzTxYM0nUnpAP4F5X9d946nejD2nLRoCYRXz7JzdOS4-igHdzCBmZUdkUKvVSj3NPpn3_rW3919HyFh_4PJh8lesvS9E",
      industry: "Phát triển Phần mềm",
      rating: 4.5,
      reviews: 1250,
      description: "FPT Software là công ty xuất khẩu dịch vụ phần mềm lớn nhất Việt Nam với môi trường làm việc năng động và chuyên nghiệp.",
      jobCount: 52,
      badge: "Hot" as const,
    },
    {
      id: 2,
      name: "VNG Corporation",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhy8D5oHbhIk0Op3x2aWBwDga9CfhEgVDzPA5FIlkXaTg4dJhM0pMkoDZDhhAxw05LXZvLwbZdmJNclcOkZZ_3zR-f9iB1k272iw6aDJz_x0AK1TGz23ZfiVMOWM6ox2pctDlpJP5AOf7dsZ95js2OCHcJjXFvmdCKUUYBeOGjh8pxeid8KBHsywcAzD5qLDkvR4OG6jSajYuazsaJW-wl0V0SZnW_ZWRcrk2ha-DxXpOSkxW-HGciN1HxGgPGpuSI9VUCm3mziyM",
      industry: "Công nghệ & Giải trí",
      rating: 4.2,
      reviews: 840,
      description: "VNG là công ty Internet hàng đầu Việt Nam, sở hữu hệ sinh thái sản phẩm phong phú từ game, mạng xã hội đến thanh toán.",
      jobCount: 34,
    },
    {
      id: 3,
      name: "Momo (M-Service)",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAo4hngdRbhkSgAjDBzY2gOAMeqX-nG6IpHNJaVwvzu5ALMFdudIPyUa07mzs3djfSgjxwmKXdIbcMg7c5zy01hK6JERaUS-4VBiGwhqRIEAmx2PMbIkpZM3hPu1gjzlKe_XPCRA8srOM9X2KdfkQjS24xM6-vHoNYBj7zjmtzBDhiR5WjAiuZX64RliATba7freLTsed6YCyuUsvbN34fySOmDDs-D04V7EucxWC6jDg-nykDPKjuCS6W1dBOUfr63_AqP4kNznJg",
      industry: "Tài chính Công nghệ",
      rating: 4.8,
      reviews: 2100,
      description: "MoMo là siêu ứng dụng thanh toán hàng đầu Việt Nam, cung cấp giải pháp tài chính số hiện đại và tiện lợi cho người dùng.",
      jobCount: 18,
      badge: "Top Rated" as const,
    },
    {
      id: 4,
      name: "Shopee Vietnam",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUYzmAtuZBCsLHCVEPHddkWouEXQqS7JqUJcEpd8X3UIOVVZQAOWveofDWOGkaNlfv6CE7ALwYUv8dInW8CW4U2ZtsXWl-WAxYShuSR0cukueMwMFgrU-15mJA1j65zpUFguGrpgzwyk9WrPngZxPy9Wq3Xb9Z0bc2BCc-_Le-MMcSGSZ4iuNwhBe5Ha1Hhjux4YfeFHY5AU2cw_6zW54HAyRc3z1KazcOGt0PQAm2IRg3jk5qOyAJtLJHxRS5J0LOT9VK21ZojLk",
      industry: "Thương mại điện tử",
      rating: 4.6,
      reviews: 1850,
      description: "Nền tảng thương mại điện tử lớn nhất khu vực Đông Nam Á, mang đến cơ hội thăng tiến và môi trường quốc tế.",
      jobCount: 64,
    },
    {
      id: 5,
      name: "Viettel Solutions",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA66HE2sZz51UHPyo93FD0EgW8YH0-CkyVWQkvfwWDcA8QXrrd2AbPYJFiRgw4S0kS7dmkrOY6E2Kdb-5JGQ-vJq1JsCPIQ1HPYfRURlSIx5e4U2s7VsO04LTS-IlEJP1CdUYvG8z8PGcZIuGCCPkBcu6Qt6UCkvSjMnxKxTO9dOjwGEIlEeL2zmSuGcwGjLIpDVpnmWYP_BmmmyhR6rirynRmrpOLIRmptsjSLD4cvmnONps5RwID4fNEvhLpGs7kF5WzrPPCNQHM",
      industry: "Viễn thông & CNTT",
      rating: 4.3,
      reviews: 620,
      description: "Thành viên của Tập đoàn Viettel, tập trung vào việc cung cấp các giải pháp chuyển đổi số cho Chính phủ và Doanh nghiệp.",
      jobCount: 42,
    },
    {
      id: 6,
      name: "Techcombank",
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx2smH0oOn78weIDNZuxM7teb_v1Uxbdn7i8P55zI7-8PS4XeJpWAWbVLOi7ATu7hVbwZc1_OBJobw1QJ5jJ7i3KIEDvQhMNNgWKorJcTblR7xWWmrkN3WhM2OY29u2oXoiEqDEfMJLmBpveV_xll8BEevK9BXA4obMt6JLksklg-ekbUDmsWmS-iKV4E6pZ_kvwRHBTg3_JkrSjww1axqN1Veu67d2RtNRpTBAUD4eufCuBUqGguzwOs6XeRi1HFFqiWYbt-W8EU",
      industry: "Ngân hàng số",
      rating: 4.1,
      reviews: 540,
      description: "Một trong những ngân hàng đi đầu trong cuộc cách mạng số hóa tài chính tại Việt Nam với đội ngũ kỹ sư tài năng.",
      jobCount: 28,
    },
  ]

  return (
    <AppTheme>
      <CssBaseline />
      <AppAppBar />
      
      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "grey.900" : "grey.50",
        }}
      >
        <CompanyHero />
        
        <Box sx={{ width: "100%", bgcolor: "background.default" }}>
          <CompanyFilters />
          
          <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, pb: 10 }}>
            <Grid container spacing={3}>
              {companies.map((company) => (
                <Grid item xs={12} sm={6} md={4} key={company.id}>
                  <CompanyCard {...company} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination Component replacing the hardcoded one */}
            <Box display="flex" justifyContent="center" mt={6}>
              <MuiPagination
                count={12}
                color="primary"
                shape="rounded"
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ChevronLeftIcon, next: ChevronRightIcon }}
                    {...item}
                  />
                )}
                sx={{
                  "& .MuiPaginationItem-root": {
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  },
                  "& .Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                }}
              />
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Re-use global Footer */}
      <Box sx={{ bgcolor: "background.paper" }}>
        <Footer />
      </Box>
    </AppTheme>
  )
}
