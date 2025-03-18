
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToggleStarEmail } from '@/services/emailService';

interface EmailCardProps {
  email: {
    id: string;
    sender: {
      name: string;
      email: string;
      avatar?: string;
    };
    subject: string;
    preview?: string;
    date: Date;
    isRead: boolean;
    isStarred: boolean;
    labels?: string[];
    aiSummary?: string;
  };
  onStarToggle: (e: React.MouseEvent) => void;
}

export const EmailCard: React.FC<EmailCardProps> = ({ email, onStarToggle }) => {
  return (
    <Card 
      className={`
        mb-3 p-4 hover:shadow-md transition-all cursor-pointer overflow-hidden
        ${email.isRead ? 'bg-card' : 'bg-card border-l-4 border-l-primary'}
      `}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={email.sender.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {email.sender.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="truncate font-medium">
              {email.sender.name}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button
                variant="ghost" 
                size="icon" 
                className={`h-7 w-7 ${email.isStarred ? 'text-amber-500' : 'text-muted-foreground'}`}
                onClick={onStarToggle}
              >
                <Star className="h-4 w-4" />
              </Button>
              <div className="flex items-center whitespace-nowrap">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(email.date, { addSuffix: true })}
              </div>
            </div>
          </div>
          
          <div className="font-medium mt-1 truncate">{email.subject}</div>
          
          {email.preview && (
            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {email.preview}
            </div>
          )}
          
          {email.aiSummary && (
            <div className="mt-2 p-2 bg-secondary/50 text-sm rounded-md border border-border">
              <span className="font-medium text-xs text-primary">AI SUMMARY:</span> {email.aiSummary}
            </div>
          )}
          
          {email.labels && email.labels.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {email.labels.map((label) => (
                <Badge key={label} variant="outline" className="flex items-center gap-1 px-2 py-0.5">
                  <Tag className="h-3 w-3" />
                  {label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
