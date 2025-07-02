// src/pages/LandingPage.jsx
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorks";
import CTASection from "./CTASection";
import Footer from "./Footer";

export default function LandingPage() {
    return (
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-cyan-200">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <CTASection />
            <Footer />
        </div>
    );
}
