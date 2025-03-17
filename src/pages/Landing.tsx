
import React, { useEffect } from 'react';
import { LandingLayout } from '@/components/layouts/LandingLayout';
import { HeroSection } from '@/components/ui/custom/HeroSection';
import { FeaturesSection } from '@/components/ui/custom/FeaturesSection';
import { HowItWorksSection } from '@/components/ui/custom/HowItWorksSection';
import { TestimonialSection } from '@/components/ui/custom/TestimonialSection';
import { PricingSection } from '@/components/ui/custom/PricingSection';
import { CallToAction } from '@/components/ui/custom/CallToAction';

const Landing = () => {
  // Animation observer for scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      document.querySelectorAll('.reveal').forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <LandingLayout>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialSection />
      <PricingSection />
      <CallToAction />
    </LandingLayout>
  );
};

export default Landing;
