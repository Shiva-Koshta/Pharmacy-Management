// src/pages/LandingPage.jsx
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorks";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function LandingPage() {
    return (
        <div className="bg-gray-900 text-cyan-200">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <CTASection />
            <Footer />
        </div>
    );
}
