// components/PageBackground.tsx
"use client"

import { Stack } from "@mui/material"
import { Theme } from "@mui/material/styles"
import { ReactNode } from "react"

interface PageBackgroundProps {
  children: ReactNode
}

export default function Background({ children }: PageBackgroundProps) {
  return (
    <Stack
      direction="column"
      component="main"
      sx={[
        {
          justifyContent: "center",
          height: "calc((1 - var(--template-frame-height, 0)) * 100%)",
          marginTop: "max(40px - var(--template-frame-height, 0px), 0px)",
          // minHeight: "100%",
          minHeight: "100vh",
          position: "relative", // cần để pseudo element hoạt động
        },
        (theme: Theme) => ({
          "&::before": {
            content: '""',
            display: "block",
            position: "absolute",
            zIndex: -1,
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
            backgroundRepeat: "no-repeat",
            ...theme.applyStyles?.("dark", {
              backgroundImage:
                "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
            }),
          },
        }),
      ]}
    >
      {children}
    </Stack>
  )
}
