import { auth } from "@/auth/config"
import AppAppBar from "@/components/AppAppBar"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import Highlights from "@/components/Highlights"
import HotJobs from "@/components/HotJobs"
import ServiceGrid from "@/components/ServiceGrid"
import AppTheme from "@/shared-theme/AppTheme"
import CssBaseline from "@mui/material/CssBaseline"
import Divider from "@mui/material/Divider"

// @ts-ignore
export default async function Home() {
  const session = await auth()

  if (session) {
    console.log("📌 Server-side Session data:", session)
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <ServiceGrid />
        <HotJobs />
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
