
import React from 'react';
import { LandingLayout } from '@/components/layouts/LandingLayout';
import { HeroSection } from '@/components/ui/custom/HeroSection';
import { FeaturesSection } from '@/components/ui/custom/FeaturesSection';
import { HowItWorksSection } from '@/components/ui/custom/HowItWorksSection';
import { TestimonialSection } from '@/components/ui/custom/TestimonialSection';
import { PricingSection } from '@/components/ui/custom/PricingSection';
import { CallToAction } from '@/components/ui/custom/CallToAction';

const Index = () => {
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

export default Index;
