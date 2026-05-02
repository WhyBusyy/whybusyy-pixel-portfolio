import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhyBusyy · Pixel Portfolio",
  description:
    "픽셀 아트 게임형 포트폴리오 — 유병규 (Fullstack Developer, Frontend 중심)",
  openGraph: {
    title: "WhyBusyy · Pixel Portfolio",
    description:
      "캐릭터를 조종해 약국·카페 거리를 돌아다니며 NPC와 대화하는 2D RPG 형식의 포트폴리오.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "WhyBusyy · Pixel Portfolio",
    description:
      "픽셀 아트 게임형 포트폴리오 — 유병규 (Fullstack Developer, Frontend 중심)",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0e0e1a",
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
