"use client"
import CssBaseline from "@mui/material/CssBaseline"
import Divider from "@mui/material/Divider"
import AppAppBar from "./components/AppAppBar"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import Highlights from "./components/Highlights"
import AppTheme from "./shared-theme/AppTheme"
// @ts-ignore
export default function Home() {
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
