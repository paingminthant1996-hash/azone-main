import Hero from "@/components/home/Hero";
import FeaturedTemplates from "@/components/home/FeaturedTemplates";
import LegacyCollection from "@/components/home/LegacyCollection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedTemplates />
      <LegacyCollection />
    </div>
  );
}

