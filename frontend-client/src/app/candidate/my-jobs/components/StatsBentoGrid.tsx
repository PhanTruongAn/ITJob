"use client"
import { Box, Chip, Grid, Paper, Typography } from "@mui/material"

interface StatItem {
  label: string
  value: number
  sub: string | null
  subColor: string | null
  isOffer?: boolean
}

interface StatsBentoGridProps {
  stats: StatItem[]
}

export default function StatsBentoGrid({ stats }: StatsBentoGridProps) {
  return (
    <Grid container spacing={2.5} sx={{ mb: 4 }}>
      {stats.map((stat) => (
        <Grid item xs={6} md={3} key={stat.label}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {stat.label}
            </Typography>
            <Box display="flex" alignItems="baseline" gap={1}>
              <Typography
                variant="h4"
                fontWeight="900"
                color={stat.isOffer ? "success.main" : "primary.main"}
              >
                {stat.value}
              </Typography>
              {stat.sub &&
                (stat.isOffer ? (
                  <Chip
                    label={stat.sub}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      fontSize: "0.65rem",
                      bgcolor: "success.light",
                      color: "success.dark",
                      borderRadius: 999,
                      height: 20,
                    }}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    color={stat.subColor || "text.secondary"}
                  >
                    {stat.sub}
                  </Typography>
                ))}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}
