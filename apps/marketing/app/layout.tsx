import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ParaCompanion — Structured Documentation for Paramedics",
  description:
    "A documentation and handover aid built by a UK paramedic. Structure your observations, timelines, and handovers — on or offline. The clinical decisions stay with you.",
  keywords: [
    "paramedic",
    "documentation",
    "handover",
    "NEWS2",
    "paediatric",
    "MOEWS",
    "ambulance",
    "UK",
    "offline",
    "cognitive aid",
  ],
  openGraph: {
    title: "ParaCompanion — Structured Documentation for Paramedics",
    description:
      "A documentation and handover aid built by a UK paramedic. Structure your observations, timelines, and handovers — on or offline.",
    type: "website",
    url: "https://paracompanion.co.uk",
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
