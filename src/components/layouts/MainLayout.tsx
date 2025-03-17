
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
};
