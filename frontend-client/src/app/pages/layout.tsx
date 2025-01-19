"use client";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../shared-theme/AppTheme";

export default function MainLayout({
  children,
  disableCustomTheme,
}: {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
}) {
  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <CssBaseline enableColorScheme />
      <main>{children}</main>
    </AppTheme>
  );
}
