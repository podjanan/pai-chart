import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "ChartPai — Chart Builder", description: "Build clean time-series charts in seconds" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
