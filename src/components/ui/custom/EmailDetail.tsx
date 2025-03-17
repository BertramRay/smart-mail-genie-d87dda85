
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  Mail, 
  Reply, 
  Forward, 
  Star, 
  Trash2, 
  Archive, 
  MoreHorizontal, 
  Paperclip, 
  Tag,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface EmailDetailProps {
  email: {
    id: string;
    sender: {
      name: string;
      email: string;
      avatar?: string;
    };
    recipients: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    htmlBody?: string;
    date: Date;
    isRead: boolean;
    isStarred: boolean;
    labels?: string[];
    aiSummary?: string;
    aiActions?: {
      type: 'reply' | 'forward' | 'flag' | 'archive' | 'tag';
      suggestion: string;
      confidence: number;
    }[];
    attachments?: {
      id: string;
      filename: string;
      size: string;
      type: string;
    }[];
  };
  onClose: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email, onClose }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <Mail className="h-4 w-4 mr-2" />
          Back to Inbox
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
              <DropdownMenuItem>Block sender</DropdownMenuItem>
              <DropdownMenuItem>Report spam</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0 pt-0">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">{email.subject}</h1>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={email.isStarred ? 'text-amber-500' : 'text-muted-foreground'}
                >
                  <Star className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={email.sender.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {email.sender.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{email.sender.name}</div>
                      <div className="text-sm text-muted-foreground">{email.sender.email}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(email.date, 'MMM d, yyyy h:mm a')}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">To: </span>
                    {email.recipients.join(', ')}
                  </div>
                  
                  {email.cc && email.cc.length > 0 && (
                    <div className="mt-1 text-sm">
                      <span className="text-muted-foreground">Cc: </span>
                      {email.cc.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              
              {email.labels && email.labels.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {email.labels.map((label) => (
                    <Badge key={label} variant="outline" className="flex items-center gap-1 px-2 py-0.5">
                      <Tag className="h-3 w-3" />
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
              
              {email.aiSummary && (
                <div className="mt-4 p-3 bg-secondary/50 text-sm rounded-md border border-border">
                  <div className="font-medium text-primary mb-1">AI Summary:</div>
                  <div>{email.aiSummary}</div>
                </div>
              )}
            </CardHeader>
            
            <Separator className="my-4" />
            
            <CardContent className="px-0 space-y-4">
              {email.aiActions && email.aiActions.length > 0 && (
                <Alert className="bg-primary/10 border-primary/30">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertTitle>AI Suggestions</AlertTitle>
                  <AlertDescription className="space-y-2">
                    {email.aiActions.map((action, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div>
                          {action.type === 'reply' && 'Suggested reply: '}
                          {action.type === 'forward' && 'Forward to: '}
                          {action.type === 'flag' && 'Flag as: '}
                          {action.type === 'archive' && 'Archive reason: '}
                          {action.type === 'tag' && 'Add label: '}
                          <span className="font-medium">{action.suggestion}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Apply
                        </Button>
                      </div>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="prose prose-sm max-w-none">
                {email.htmlBody ? (
                  <div dangerouslySetInnerHTML={{ __html: email.htmlBody }} />
                ) : (
                  <p className="whitespace-pre-line">{email.body}</p>
                )}
              </div>
              
              {email.attachments && email.attachments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attachments ({email.attachments.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {email.attachments.map((attachment) => (
                      <div 
                        key={attachment.id} 
                        className="flex items-center gap-3 p-2 border rounded-md hover:bg-secondary/50 transition-colors"
                      >
                        <div className="bg-secondary p-2 rounded">
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{attachment.filename}</div>
                          <div className="text-xs text-muted-foreground">{attachment.size} • {attachment.type}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="p-4 border-t bg-card">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Button className="gap-2">
            <Reply className="h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline" className="gap-2">
            <Forward className="h-4 w-4" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
};
