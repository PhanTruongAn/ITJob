"use client"
import { getPublicSkills } from "@/apis/skill"
import { ISkill } from "@/types/backend"
import SearchIcon from "@mui/icons-material/Search"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"
import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import Skeleton from "@mui/material/Skeleton"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useTranslation } from "react-i18next"

const FALLBACK_CHIPS = [
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "HTML",
  "CSS",
  "React",
  "Node.js",
]

const VIETNAM_CITIES = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Other",
]

export default function Hero() {
  const { t } = useTranslation()
  const router = useRouter()
  const [city, setCity] = React.useState("")
  const [keyword, setKeyword] = React.useState("")
  const [skills, setSkills] = React.useState<string[]>(FALLBACK_CHIPS)
  const [loadingSkills, setLoadingSkills] = React.useState(true)

  // Load suggested skills from API
  React.useEffect(() => {
    getPublicSkills()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setSkills(res.data.slice(0, 8).map((s: ISkill) => s.name))
        }
      })
      .catch(() => {
        // Keep fallback chips on error
      })
      .finally(() => setLoadingSkills(false))
  }, [])

  const handleCityChange = (event: SelectChangeEvent) => {
    setCity(event.target.value)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (keyword.trim()) params.set("keyword", keyword.trim())
    if (city) params.set("location", city)
    router.push(`/jobs?${params.toString()}`)
  }

  const handleChipClick = (skillName: string) => {
    const params = new URLSearchParams()
    params.set("keyword", skillName)
    if (city) params.set("location", city)
    router.push(`/jobs?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",

        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), rgb(243, 245, 247))",
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
              <InputLabel id="select-city">Chọn thành phố</InputLabel>
              <Select
                labelId="select-city"
                value={city}
                onChange={handleCityChange}
                sx={{ height: "50px", fontSize: "15px" }}
                variant="outlined"
              >
                <MenuItem value="">
                  Tất cả các thành phố
                </MenuItem>
                {VIETNAM_CITIES.map((c, index) => (
                  <MenuItem key={index} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="search-value"
              hiddenLabel
              variant="outlined"
              placeholder={t("hero.searchPlaceholder", "Nhập từ khóa theo kỹ năng, công ty, ...")}
              fullWidth
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
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
              onClick={handleSearch}
            >
              {t("hero.searchBtn", "Tìm kiếm")}
            </Button>
          </Stack>

          <Stack
            spacing={1}
            direction="row"
            useFlexGap
            sx={{ flexWrap: "wrap", mt: 1, alignItems: "center" }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: "center", fontSize: "15px" }}
            >
              Gợi ý cho bạn:
            </Typography>
            {loadingSkills ? (
              <Stack direction="row" spacing={1}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rounded"
                    width={70}
                    height={28}
                    sx={{ borderRadius: 4 }}
                  />
                ))}
              </Stack>
            ) : (
              skills.map((chip, index) => (
                <Chip
                  sx={{
                    ml: 2,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "common.white",
                      transform: "translateY(-1px)",
                    },
                  }}
                  variant="outlined"
                  size="medium"
                  key={`${chip}-${index}`}
                  label={chip}
                  onClick={() => handleChipClick(chip)}
                />
              ))
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
