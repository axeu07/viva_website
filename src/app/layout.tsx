import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Manrope, Instrument_Serif, JetBrains_Mono, Doto } from "next/font/google";
import { site } from "@/lib/content";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { SoundProvider } from "@/components/Sound";
import Ambience from "@/components/Ambience";
import Cursor from "@/components/Cursor";
import DayClock from "@/components/DayClock";
import Nav from "@/components/Nav";
import { LightsProvider } from "@/components/Lights";
import Intro from "@/components/Intro";
import { SITE_URL } from "@/lib/seo";
import { INTRO_BOOT } from "@/lib/intro";

// Headlines: Big Shoulders (formerly "Big Shoulders Display"), display optical size.
const display = Big_Shoulders({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
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

// Mono micro-labels, chips and readouts.
const mono = JetBrains_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

// LED dot-matrix display on the treadmill console only.
const dot = Doto({
  variable: "--ff-dot",
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${site.name}, Dehradun | Gym, classes & café`,
  description: site.metaDescription,
  alternates: { canonical: "/" },
  keywords: ["gym in Dehradun", "Viva Premium Gym", "Zumba Dehradun", "Bhangra fitness", "Yoga Dehradun", "personal trainer Dehradun", "GMS Road gym"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.altName,
    title: `${site.name}, Dehradun | Lights on.`,
    description: site.metaDescription,
    images: [{ url: "/media/img/floor-energy-782.webp", width: 782, height: 470, alt: "The Viva gym floor under neon and LED strips" }],
  },
  twitter: { card: "summary_large_image", title: `${site.name}, Dehradun`, description: site.metaDescription, images: ["/media/img/floor-energy-782.webp"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#101010",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${accent.variable} ${mono.variable} ${dot.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Welcome intro: decide before first paint so the hero never flashes (see lib/intro.ts) */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
      </head>
      <body className="min-h-full">
        <SoundProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-full focus:bg-gold-1 focus:px-4 focus:py-2 focus:text-wall">
            Skip to content
          </a>
          <LightsProvider>
            <SmoothScroll />
            <Nav />
            {children}
            <Ambience />
            <DayClock />
            <Intro />
            <Cursor />
          </LightsProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
