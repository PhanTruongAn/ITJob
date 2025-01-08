import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import Chip from "@mui/material/Chip";
import Image from "next/image";

const items = [
  {
    icon: <SettingsSuggestRoundedIcon />,
    url: "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1736335373/Company/cp1.webp",
    title: "YOONG",
    skills: [
      "JavaScript",
      "Python",
      "Java",
      "C#",
      "HTML",
      "CSS",
      "React",
      "Node.js",
    ],
  },
  {
    icon: <ConstructionRoundedIcon />,
    url: "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1736335372/Company/cp2.webp",
    title: "Hitachi Digital Services",
    skills: [
      "JavaScript",
      "Python",
      "Java",
      "C#",
      "HTML",
      "CSS",
      "React",
      "Node.js",
    ],
  },
  {
    icon: <ThumbUpAltRoundedIcon />,
    url: "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1736335372/Company/cp3.png",
    title: "SkyLab",
    skills: [
      "JavaScript",
      "Python",
      "Java",
      "C#",
      "HTML",
      "CSS",
      "React",
      "Node.js",
    ],
  },
  {
    icon: <AutoFixHighRoundedIcon />,
    url: "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1736335372/Company/cp7.webp",
    title: "Persol Career Tech Studio Vietnam",
    skills: [
      "JavaScript",
      "Python",
      "Java",
      "C#",
      "HTML",
      "CSS",
      "React",
      "Node.js",
    ],
  },
  {
    icon: <SupportAgentRoundedIcon />,
    url: "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1736335372/Company/cp5.webp",
    title: "Hybrid Technologies",
    skills: [
      "JavaScript",
      "Python",
      "Java",
      "C#",
      "HTML",
      "CSS",
      "React",
      "Node.js",
    ],
  },
  {
    icon: <QueryStatsRoundedIcon />,
    url: "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1736335373/Company/cp6.webp",
    title: "Samsung Electronics HCMC CE Complex",
    skills: [
      "JavaScript",
      "Python",
      "Java",
      "C#",
      "HTML",
      "CSS",
      "React",
      "Node.js",
    ],
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography
            component="h2"
            variant="h2"
            sx={(theme) => ({
              color: "grey.800",
              ...theme.applyStyles("dark", {
                color: "primary.light",
              }),
            })}
            gutterBottom
          >
            Nhà tuyển dụng hàng đầu
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ sm: 12, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                variant="highlighted"
                useFlexGap
                sx={{
                  cursor: "pointer",
                  p: 3,
                  height: "100%",
                  borderColor: "hsla(220, 25%, 25%, 0.3)",
                  backgroundColor: "hsla(218, 12.80%, 38.20%, 0.18)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={item.url}
                    width={170}
                    height={170}
                    alt="Screenshots of the dashboard project showing desktop version"
                    style={{
                      borderRadius: "10px",
                    }}
                  />
                </Box>
                <div>
                  <Typography
                    gutterBottom
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Stack
                    spacing={1}
                    direction="row"
                    useFlexGap
                    sx={{ flexWrap: "wrap", justifyContent: "center" }}
                  >
                    {item.skills.map((skill, index) => (
                      <Chip
                        variant="outlined"
                        size="medium"
                        key={index}
                        label={skill}
                      />
                    ))}
                  </Stack>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
