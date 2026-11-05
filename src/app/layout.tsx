import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/config/site";
export const metadata: Metadata = { title: site.title, description: "A birthday surprise." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
