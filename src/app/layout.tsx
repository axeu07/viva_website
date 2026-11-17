import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Manrope, Instrument_Serif } from "next/font/google";
import { site } from "@/lib/content";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { SoundProvider } from "@/components/Sound";
import Ambience from "@/components/Ambience";
import Cursor from "@/components/Cursor";
import DayClock from "@/components/DayClock";
import Nav from "@/components/Nav";

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
      <body className="min-h-full">
        <SoundProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-gold-1 focus:px-4 focus:py-2 focus:text-wall">
            Skip to content
          </a>
          <SmoothScroll />
          <Nav />
          {children}
          <Ambience />
          <DayClock />
          <Cursor />
        </SoundProvider>
      </body>
    </html>
  );
}
