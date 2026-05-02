import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhyBusyy · Pixel Portfolio",
  description:
    "픽셀 아트 게임형 포트폴리오 — 유병규 (Fullstack Developer, Frontend 중심)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="h-full m-0 p-0 overflow-hidden bg-black">
        {children}
      </body>
    </html>
  );
}
