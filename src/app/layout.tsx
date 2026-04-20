import type { Metadata } from "next";
import { Red_Hat_Display, JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Red_Hat_Display({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const dmMono = JetBrains_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const instrumentSerif = Source_Serif_4({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "OralSense — Salivary OSCC Detection",
  description:
    "A nanobody lateral flow assay targeting salivary Hemopexin — rapid, non-invasive triage for oral squamous cell carcinoma.",
  openGraph: {
    title: "OralSense — Salivary OSCC Detection",
    description:
      "A nanobody lateral flow assay targeting salivary Hemopexin — rapid, non-invasive triage for oral squamous cell carcinoma.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OralSense — Salivary OSCC Detection",
    description:
      "Nanobody LFA platform for salivary Hemopexin — non-invasive oral cancer triage.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Navbar />
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
