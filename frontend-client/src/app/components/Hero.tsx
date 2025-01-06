import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
// const StyledBox = styled("div")(({ theme }) => ({
//   alignSelf: "center",
//   width: "100%",
//   height: 400,
//   marginTop: theme.spacing(8),
//   borderRadius: theme.shape.borderRadius,
//   outline: "6px solid",
//   outlineColor: "hsla(220, 25%, 80%, 0.2)",
//   border: "1px solid",
//   borderColor: theme.palette.grey[200],
//   boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
//   backgroundImage: `url(${
//     process.env.TEMPLATE_IMAGE_URL || "https://mui.com"
//   }/static/screenshots/material-ui/getting-started/templates/dashboard.jpg)`,
//   backgroundSize: "cover",
//   [theme.breakpoints.up("sm")]: {
//     marginTop: theme.spacing(10),
//     height: 700,
//   },
//   ...theme.applyStyles("dark", {
//     boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
//     backgroundImage: `url(${
//       process.env.TEMPLATE_IMAGE_URL || "https://mui.com"
//     }/static/screenshots/material-ui/getting-started/templates/dashboard-dark.jpg)`,
//     outlineColor: "hsla(220, 20%, 42%, 0.1)",
//     borderColor: theme.palette.grey[700],
//   }),
// }));

export default function Hero() {
  const [cities, setCities] = React.useState("Tất cả các thành phố");
  const [chipSelected, setChipSelected] = React.useState("");
  const vietnam_cities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Other"];
  const chip_data = [
    "JavaScript",
    "Python",
    "Java",
    "C#",
    "HTML",
    "CSS",
    "React",
    "Node.js",
  ];
  const handleChange = (event: SelectChangeEvent) => {
    setCities(event.target.value);
  };
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",

        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
        }),
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 15 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              fontSize: "clamp(1rem, 10vw, 2rem)",
            }}
          >
            500&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={(theme) => ({
                fontSize: "inherit",
                color: "primary.main",
                ...theme.applyStyles("dark", {
                  color: "primary.light",
                }),
              })}
            >
              việc làm IT
            </Typography>
            &nbsp;dành cho lập trình viên
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "80%" },
            }}
          >
            Tiếp cận các tin tuyển dụng việc làm mỗi ngày từ các doanh nghiệp uy
            tín tại Việt Nam
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: "100%", sm: "800px" } }}
          >
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={cities}
                onChange={handleChange}
                sx={{ height: "50px", fontSize: "15px" }}
              >
                <MenuItem value="Tất cả các thành phố">
                  Tất cả các thành phố
                </MenuItem>
                {vietnam_cities.map((city, index) => (
                  <MenuItem key={index} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="search-value"
              hiddenLabel
              variant="outlined"
              placeholder="Nhập từ khóa theo kỹ năng, công ty, ..."
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  height: "50px",
                  fontSize: "15px",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ minWidth: "fit-content" }}
              startIcon={<SearchIcon />}
            >
              Tìm kiếm
            </Button>
          </Stack>

          <Stack
            spacing={1}
            direction="row"
            useFlexGap
            sx={{ flexWrap: "wrap", mt: 1 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: "center", fontSize: "15px" }}
            >
              Gợi ý cho bạn:
            </Typography>
            {chip_data.map((chip, index) => (
              <Chip
                sx={{ ml: 2 }}
                variant="outlined"
                size="medium"
                key={index}
                label={chip}
                onClick={() => setChipSelected(chip)}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
