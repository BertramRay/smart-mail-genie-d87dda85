
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

export const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "Smart Mail Genie transformed how I handle emails. I now save at least an hour every day thanks to the AI analysis and custom rules.",
      author: {
        name: "Alex Morgan",
        title: "Product Manager",
        avatar: "https://i.pravatar.cc/150?img=3"
      }
    },
    {
      quote: "The natural language rules are a game-changer. I just described how I wanted my emails filtered, and the AI understood perfectly.",
      author: {
        name: "Sarah Chen",
        title: "Software Engineer",
        avatar: "https://i.pravatar.cc/150?img=5"
      }
    },
    {
      quote: "As a busy executive, Smart Mail Genie helps me focus on important messages and never miss critical information. Worth every penny.",
      author: {
        name: "Michael Rodriguez",
        title: "CEO",
        avatar: "https://i.pravatar.cc/150?img=8"
      }
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="chip bg-primary/10 text-primary">Testimonials</span>
          <h2 className="heading-lg mt-4 mb-4">What Our Users Say</h2>
          <p className="text-foreground/70">
            Join thousands of professionals who have transformed their email workflow with Smart Mail Genie.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border border-border hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-foreground/80 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.author.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.author.name}</div>
                    <div className="text-sm text-foreground/60">{testimonial.author.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
