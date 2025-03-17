
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-secondary py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <span>Smart Mail Genie</span>
            </Link>
            <p className="text-foreground/70 text-sm">
              AI-powered email management to help you focus on what matters most.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/#features" className="text-foreground/70 hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/#how-it-works" className="text-foreground/70 hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link to="/#pricing" className="text-foreground/70 hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-foreground/70 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-foreground/70 hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="text-foreground/70 hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-foreground/70 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-foreground/70 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-foreground/70 hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-foreground/10 mt-8 pt-8 text-center text-sm text-foreground/70">
          &copy; {new Date().getFullYear()} Smart Mail Genie. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
