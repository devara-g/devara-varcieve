import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#07080b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Muhammad Devara — Backend Architect & Distributed Systems Engineer",
  description:
    "Engineering high-concurrency microservices, sub-20ms P99 APIs, database query optimization, and resilient full-stack platforms.",
  keywords: [
    "Muhammad Devara",
    "Devara",
    "Backend Architect",
    "Distributed Systems",
    "Systems Engineer",
    "PostgreSQL",
    "Node.js",
    "Laravel",
    "Docker",
    "Redis",
    "Next.js",
    "Software Engineer",
  ],
  authors: [{ name: "Muhammad Devara" }],
  openGraph: {
    title: "Muhammad Devara — Backend Architect & Distributed Systems Engineer",
    description:
      "Engineering high-concurrency microservices, sub-20ms P99 APIs, database query optimization, and resilient full-stack platforms.",
    url: "https://devara.dev",
    siteName: "Muhammad Devara Portfolio",
    images: [
      {
        url: "/assets/og.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Devara — Systems Engineering Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Devara — Backend Architect & Distributed Systems Engineer",
    description:
      "Engineering high-concurrency microservices, sub-20ms P99 APIs, database query optimization, and resilient full-stack platforms.",
    images: ["/assets/og.png"],
  },
  icons: {
    icon: "/assets/siganteng.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark scroll-smooth`}>
      <body className="bg-[#07080b] text-slate-100 font-sans antialiased min-h-screen selection:bg-cyan-500/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
