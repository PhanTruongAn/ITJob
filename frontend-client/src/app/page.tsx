"use client"
import AppTheme from "@/shared-theme/AppTheme"
import CssBaseline from "@mui/material/CssBaseline"
import Divider from "@mui/material/Divider"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import AppAppBar from "../components/AppAppBar"
import Footer from "../components/Footer"
import Hero from "../components/Hero"
import Highlights from "../components/Highlights"
// @ts-ignore
export default function Home() {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log("🚀 Session status:", status)
    console.log("🚀 Full session:", session)
  }, [session, status])
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <Highlights />
        {/* <LogoCollection />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />

        <Divider />
        <Pricing />
        <Divider />
        <FAQ /> */}
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  )
}
