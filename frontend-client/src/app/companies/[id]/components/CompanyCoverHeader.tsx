"use client"
import Box from "@mui/material/Box"

interface CompanyCoverHeaderProps {
  coverImage?: string
}

export default function CompanyCoverHeader({ coverImage }: CompanyCoverHeaderProps) {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 220, md: 320 },
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          coverImage ||
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDPLh7lRKHNsB9Wi2evrnEs8pCq2E6bCYBJ1L3HiIrL4NynJQcuEQwSVPDtAKlgZlSrpHeyKl35zlVbaIi0TTLaFNLim0ZfECRT8QFkbH1653InfJ4h6YTxx_QqD7a__rzRiIVazoUWcYNEgdYJVtVYGOX69LnjWKJvkHy0Ny9nPTCOG6RbhQxxaOPwjVE1vz6QSFwtqTm1KwogdEd_r3SnIJt0VU11_oeV-SqP0Pu7V3kAbbansH9IlMXjJXB9EgVgw46pjQAjexs"
        }
        alt="Company cover"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
        }}
      />
    </Box>
  )
}
