import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Interactive Background Removal Tool - Try it now! */}
        <HeroSection />
        
        {/* Real Features - What QuickBG Actually Does */}
        <FeaturesSection />
        
        {/* Simple 3-Step Process */}
        <HowItWorksSection />
        
        {/* Final Call-to-Action */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

