import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import FeaturedTemplates from "@/components/home/FeaturedTemplates";
import CategoryLinks from "@/components/home/CategoryLinks";
import LegacyCollection from "@/components/home/LegacyCollection";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedTemplates />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <CategoryLinks />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <LegacyCollection />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Newsletter />
      </Suspense>
    </div>
  );
}

