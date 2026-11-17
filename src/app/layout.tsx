import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Manrope, Instrument_Serif } from "next/font/google";
import { site } from "@/lib/content";
import "./globals.css";

// Headlines: Big Shoulders (formerly "Big Shoulders Display"), display optical size.
const display = Big_Shoulders({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["800", "900"],
  display: "swap",
});

const body = Manrope({
  variable: "--ff-body",
  subsets: ["latin"],
  display: "swap",
});

// Single-word italic emphasis only.
const accent = Instrument_Serif({
  variable: "--ff-accent",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name}, Dehradun | Lights on.`,
  description: site.metaDescription,
};

export const viewport: Viewport = {
  themeColor: "#070605",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${accent.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
