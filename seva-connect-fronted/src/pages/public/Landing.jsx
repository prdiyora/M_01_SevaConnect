// src/pages/public/Landing.jsx

import React, { useState, useEffect } from "react";
import "./Landing.css";
import AvailableServices from "../../components/common/AvailableServices";
import LandingNavbar from "../../components/landing/LandingNavbar";
import HeroSection from "../../components/landing/HeroSection";
import AboutSection from "../../components/landing/AboutSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import HowItWorksSection from "../../components/landing/HowItWorksSection";
import StatsSection from "../../components/landing/StatsSection";
import TestimonialsSection from "../../components/landing/TestimonialsSection";
import CTASection from "../../components/landing/CTASection";
import LandingFooter from "../../components/landing/LandingFooter";

const Landing = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="landing">
      <LandingNavbar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        scrollToSection={scrollToSection} 
        isLoggedIn={isLoggedIn} 
      />

      <HeroSection scrollToSection={scrollToSection} />

      <AboutSection />

      <FeaturesSection />

      <AvailableServices />

      <HowItWorksSection />

      <StatsSection />

      <TestimonialsSection />

      <CTASection />

      <LandingFooter scrollToSection={scrollToSection} />
    </div>
  );
};

export default Landing;
