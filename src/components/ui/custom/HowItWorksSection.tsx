
import React from 'react';
import { ArrowRight } from 'lucide-react';

export const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Connect Your Email',
      description: 'Sign in with GitHub and add your email accounts using SMTP and IMAP credentials.',
    },
    {
      number: '02',
      title: 'Define Processing Rules',
      description: 'Create natural language rules for how you want the AI to handle different types of emails.',
    },
    {
      number: '03',
      title: 'Let AI Work',
      description: 'Smart Mail Genie will analyze, categorize, and summarize your emails automatically.',
    },
    {
      number: '04',
      title: 'Stay in Control',
      description: 'Review AI actions, approve or modify suggestions, and fine-tune your email workflow.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="chip bg-primary/10 text-primary">How It Works</span>
          <h2 className="heading-lg mt-4 mb-4">Simple, Intelligent Email Management</h2>
          <p className="text-foreground/70">
            Get started in minutes and transform your email workflow with our AI assistant.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="p-6 bg-card border border-border rounded-lg hover:shadow-md transition-all">
                <div className="text-4xl font-bold text-primary/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-foreground/70">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-primary">
                  <ArrowRight className="h-8 w-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
