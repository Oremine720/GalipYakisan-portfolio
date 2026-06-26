import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://galipyakisan.com"),
  title: {
    default: "Galip Yakışan — Full Stack Developer & AI Enthusiast",
    template: "%s | Galip Yakışan",
  },
  description:
    "Galip Yakışan — Full Stack Developer ve AI Enthusiast. C#, ASP.NET Core, React Native ve yapay zeka teknolojileri ile modern dijital deneyimler geliştiriyor.",
  keywords: [
    "Galip Yakışan",
    "Full Stack Developer",
    "AI Enthusiast",
    "C# Developer",
    "ASP.NET Core",
    "React Native",
    "Web Developer",
    "Software Engineer",
    "Portfolio",
    "Türkiye",
    "Burdur",
  ],
  authors: [{ name: "Galip Yakışan", url: "https://galipyakisan.com" }],
  creator: "Galip Yakışan",
  publisher: "Galip Yakışan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://galipyakisan.com",
    siteName: "Galip Yakışan",
    title: "Galip Yakışan — Full Stack Developer & AI Enthusiast",
    description:
      "C#, ASP.NET Core, React Native ve yapay zeka teknolojileri ile modern dijital deneyimler geliştiriyor.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Galip Yakışan — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galip Yakışan — Full Stack Developer",
    description:
      "C#, ASP.NET Core, React Native ve yapay zeka teknolojileri ile modern dijital deneyimler geliştiriyor.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark scroll-smooth">
      <head>
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} noise-overlay antialiased bg-[#080808] text-white overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
