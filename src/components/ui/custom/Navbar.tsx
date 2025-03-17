
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Mail className="w-6 h-6 text-primary" />
          <span>Smart Mail Genie</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/#features" className="font-medium text-foreground/80 hover:text-primary transition-colors">
            Features
          </Link>
          <Link to="/#how-it-works" className="font-medium text-foreground/80 hover:text-primary transition-colors">
            How it Works
          </Link>
          <Link to="/#pricing" className="font-medium text-foreground/80 hover:text-primary transition-colors">
            Pricing
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="outline" className="hidden md:inline-flex">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="animate-pulse hover:animate-none">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
