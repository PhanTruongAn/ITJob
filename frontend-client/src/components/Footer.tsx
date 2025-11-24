import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SitemarkIcon from "./SitemarkIcon";
import GitHubIcon from "@mui/icons-material/GitHub";
function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
      {"Copyright © "}
      <Link color="text.secondary" href="#">
        ITJob
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: "center", md: "left" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: { xs: "100%", sm: "30%" },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "60%" },
              display: { xs: "flex" },
              flexDirection: { xs: "column" },
            }}
          >
            <Box sx={{ alignSelf: "center" }}>
              <SitemarkIcon />
            </Box>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ fontWeight: 600, mt: 2, alignSelf: "center" }}
            >
              Việc làm IT &quot;chất&quot;
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <IconButton
                color="inherit"
                size="small"
                href="#"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                href="#"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                size="small"
                href="#"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Sản phẩm
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Tính năng
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Điểm nổi bật
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Giá cả
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Câu hỏi thường gặp
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Công ty
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Trang chủ
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Về chúng tôi
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Thông cáo báo chí
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Pháp lý
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Điều khoản
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Quyền riêng tư
          </Link>
          <Link color="text.secondary" variant="body2" href="#">
            Liên
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: { xs: 4, sm: 6 },
          width: "100%",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <div>
          <Link color="text.secondary" variant="body2" href="#">
            Privacy Policy
          </Link>
          <Typography sx={{ display: "inline", mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2" href="#">
            Terms of Service
          </Link>
          <Copyright />
        </div>
      </Box>
    </Container>
  );
}
