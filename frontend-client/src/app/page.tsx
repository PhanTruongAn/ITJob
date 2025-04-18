"use client";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppAppBar from "./components/AppAppBar";
import Hero from "./components/Hero";
import LogoCollection from "./components/LogoCollection";
import Highlights from "./components/Highlights";
import Pricing from "./components/Pricing";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import AppTheme from "./shared-theme/AppTheme";
import MainLayout from "./pages/layout";

export default function Home(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
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
  );
}
Home.getLayout = (page: React.ReactNode) => <MainLayout>{page}</MainLayout>;
