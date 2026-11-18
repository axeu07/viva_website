import Hero from "@/components/Hero";
import NeonWall from "@/components/NeonWall";
import CrossingTapes from "@/components/CrossingTapes";
import GoalFinder from "@/components/GoalFinder";
import Facilities from "@/components/Facilities";
import Classes from "@/components/Classes";
import Cafe from "@/components/Cafe";
import Coaches from "@/components/Coaches";
import Memories from "@/components/Memories";
import Proof from "@/components/Proof";
import Plans from "@/components/Plans";
import BookTrial from "@/components/BookTrial";
import Footer from "@/components/Footer";
import LightStrip from "@/components/LightStrip";
import { jsonLd } from "@/lib/seo";

const strip = <LightStrip length="min(1100px, 88vw)" intensity={0.6} />;

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <NeonWall />
        <CrossingTapes />
        <GoalFinder />
        {strip}
        <Facilities />
        {strip}
        <Classes />
        <Cafe />
        <Coaches />
        <Memories />
        {strip}
        <Proof />
        <Plans />
        <BookTrial />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
