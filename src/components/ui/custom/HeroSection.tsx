import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="mb-6 animate-fadeIn opacity-0" style={{ animationDelay: '0.2s' }}>
            <span className="chip bg-primary/10 text-primary">
              Introducing Smart Mail Genie
            </span>
          </div>
          
          <h1 className="heading-xl mb-6 animate-fadeIn opacity-0" style={{ animationDelay: '0.3s' }}>
            Your AI-Powered Email Assistant
          </h1>
          
          <p className="text-xl text-foreground/70 mb-8 animate-fadeIn opacity-0" style={{ animationDelay: '0.4s' }}>
            Focus on what matters most by letting our AI handle your inbox. Automate email management, receive intelligent summaries, and respond efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn opacity-0" style={{ animationDelay: '0.5s' }}>
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto gap-2 group">
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <Github className="w-4 h-4" />
                Login with GitHub
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="relative mx-auto max-w-4xl animate-fadeIn opacity-0" style={{ animationDelay: '0.6s' }}>
          <div className="glass rounded-xl overflow-hidden shadow-xl">
            <img 
              src="/images/dashboard-preview.png" 
              alt="Smart Mail Genie Dashboard Preview" 
              className="w-full h-auto object-cover" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/1200x800/5f57ff/ffffff?text=Smart+Mail+Genie+Dashboard";
                target.onerror = null;
              }}
            />
          </div>
          
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-primary/10 rounded-full animate-float" />
          <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </section>
  );
};
