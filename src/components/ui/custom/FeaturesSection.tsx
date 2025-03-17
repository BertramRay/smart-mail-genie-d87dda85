
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Mail, MailPlus, Brain, Tag, Clock, Zap } from 'lucide-react';

export const FeaturesSection = () => {
  const features = [
    {
      icon: Github,
      title: 'GitHub Login',
      description: 'Quick and secure authentication with your GitHub account.'
    },
    {
      icon: Mail,
      title: 'Multiple Email Accounts',
      description: 'Connect all your email accounts with SMTP and IMAP support.'
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Smart categorization and summarization of your emails.'
    },
    {
      icon: Tag,
      title: 'Custom Processing Rules',
      description: 'Create natural language rules to automatically handle emails.'
    },
    {
      icon: Clock,
      title: 'Scheduled Syncing',
      description: 'Keep your inbox up-to-date with scheduled email synchronization.'
    },
    {
      icon: Zap,
      title: 'Smart Response Suggestions',
      description: 'Get AI-generated responses tailored to your communication style.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="chip bg-primary/10 text-primary">Features</span>
          <h2 className="heading-lg mt-4 mb-4">Powerful Email Management</h2>
          <p className="text-foreground/70">
            Smart Mail Genie combines modern technology with AI to transform how you handle emails.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border bg-card hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
