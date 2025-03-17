
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for personal use",
      features: [
        "1 email account",
        "5 custom AI rules",
        "Basic email analytics",
        "GitHub authentication"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      highlight: false
    },
    {
      name: "Pro",
      price: "$12",
      description: "Ideal for professionals",
      features: [
        "5 email accounts",
        "Unlimited custom AI rules",
        "Advanced email analytics",
        "Priority support",
        "AI response suggestions"
      ],
      buttonText: "Subscribe Now",
      buttonVariant: "default" as const,
      highlight: true
    },
    {
      name: "Team",
      price: "$49",
      description: "For teams and businesses",
      features: [
        "20 email accounts",
        "Unlimited custom AI rules",
        "Advanced email analytics",
        "Priority support",
        "AI response suggestions",
        "Team management",
        "API access"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      highlight: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="chip bg-primary/10 text-primary">Pricing</span>
          <h2 className="heading-lg mt-4 mb-4">Choose Your Plan</h2>
          <p className="text-foreground/70">
            Simple, transparent pricing that scales with your needs. No hidden fees.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border ${plan.highlight ? 'border-primary shadow-lg' : 'border-border'} relative`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="chip bg-primary text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className={`text-center pb-0 ${plan.highlight ? 'pt-8' : 'pt-6'}`}>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-foreground/60">/month</span>
                </div>
                <p className="text-foreground/70">{plan.description}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link to="/signup" className="w-full">
                  <Button 
                    variant={plan.buttonVariant} 
                    className={`w-full ${plan.highlight ? 'bg-primary hover:bg-primary/90' : ''}`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
