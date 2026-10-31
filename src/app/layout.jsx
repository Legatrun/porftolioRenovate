import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/layout/Navbar";
import ScrollTheme from "@/components/ScrollTheme";
import SnapScroller from "@/components/SnapScroller";
import MotionProvider from "@/components/MotionProvider";

const inter = localFont({ src: "./fonts/Inter.woff2", variable: "--font-inter", weight: "100 900", display: "swap" });
const grotesk = localFont({ src: "./fonts/SpaceGrotesk.woff2", variable: "--font-grotesk", weight: "300 700", display: "swap" });
const mono = localFont({ src: "./fonts/JetBrainsMono.woff2", variable: "--font-jetbrains", weight: "100 800", display: "swap" });

const description =
  "Full Stack Developer with 6+ years building scalable, high-performance web apps with React, Next.js, Node.js, .NET and AWS. Currently Developer - Operations at Yape.";

export const metadata = {
  metadataBase: new URL("https://jairmerlo.netlify.app"),
  title: "Jair Merlo — Full Stack Developer",
  description,
  openGraph: {
    title: "Jair Merlo — Full Stack Developer",
    description,
    url: "https://jairmerlo.netlify.app",
    siteName: "Jair Merlo",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
};

export const viewport = { themeColor: "#0d0d0d" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="grain min-h-screen overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:bg-accent focus:text-on-accent focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <MotionProvider>
          <ScrollTheme />
          <SnapScroller />
          <Navbar />
          <main id="main">{children}</main>
        </MotionProvider>
      </body>
    </html>
  );
}
