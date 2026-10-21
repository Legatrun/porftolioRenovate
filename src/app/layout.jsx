import "./globals.css";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollTheme from "@/components/ScrollTheme";
import MotionProvider from "@/components/MotionProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", weight: ["500", "700"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", weight: ["400", "500"], display: "swap" });

const description =
  "Full Stack Developer with 6+ years building scalable, high-performance web apps with React, Next.js, Node.js, .NET and AWS. Currently Senior Frontend Developer at Yape.";

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

export const viewport = { themeColor: "#050507" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="grain min-h-screen overflow-x-clip">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[70] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded">
          Skip to content
        </a>
        <MotionProvider>
          <ScrollTheme />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
