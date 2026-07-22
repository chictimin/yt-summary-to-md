import type { Metadata } from "next";
import "./globals.css";
import { AuthNav } from "@/components/auth/auth-nav";

export const metadata: Metadata = {
  title: "yt2md",
  description: "Summarize YouTube videos to Markdown",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AuthNav />
        {children}
      </body>
    </html>
  );
}
