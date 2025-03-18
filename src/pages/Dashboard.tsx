
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { DashboardHeader } from '@/components/ui/custom/DashboardHeader';
import { EmailCard } from '@/components/ui/custom/EmailCard';
import { EmailDetail } from '@/components/ui/custom/EmailDetail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RefreshCcw, Search, Filter, Inbox, Star, Send, Archive, Trash2, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEmails, useEmail, useSyncEmails, useMarkEmailAsRead, useToggleStarEmail } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmailId, setSelectedEmailId] = useState<string | undefined>(undefined);
  
  // Fetch emails using the service
  const { 
    data: emails = [], 
    isLoading: isLoadingEmails, 
    isError: isEmailsError,
    error: emailsError
  } = useEmails(activeTab);
  
  // Fetch selected email details if needed
  const { 
    data: selectedEmail,
    isLoading: isLoadingEmailDetail
  } = useEmail(selectedEmailId);
  
  // Email sync mutation
  const { mutate: syncEmails, isPending: isSyncing } = useSyncEmails();
  
  // Mark email as read mutation
  const { mutate: markAsRead } = useMarkEmailAsRead();
  
  // Toggle star mutation
  const { mutate: toggleStar } = useToggleStarEmail();
  
  // Filter emails based on search query
  const filteredEmails = emails.filter(email => {
    if (!searchQuery) return true;
    
    return (
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
      email.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Handle email selection
  const handleEmailSelect = (emailId: string) => {
    setSelectedEmailId(emailId);
    markAsRead(emailId);
  };
  
  // Handle email sync
  const handleSyncEmails = () => {
    syncEmails(undefined, {
      onSuccess: () => {
        toast({
          title: 'Emails synchronized',
          description: 'Your inbox has been updated with the latest emails.',
        });
      },
      onError: (error) => {
        toast({
          variant: 'destructive',
          title: 'Sync failed',
          description: error instanceof Error ? error.message : 'Failed to sync emails. Please try again.',
        });
      }
    });
  };
  
  // Handle toggling star status
  const handleToggleStar = (emailId: string, isStarred: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStar({ id: emailId, isStarred });
  };
  
  // Handle closing email detail view
  const handleCloseEmailDetail = () => {
    setSelectedEmailId(undefined);
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        <DashboardHeader />
        
        <div className="flex-1 overflow-hidden">
          {selectedEmailId && selectedEmail ? (
            <EmailDetail email={selectedEmail} onClose={handleCloseEmailDetail} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] h-full">
              {/* Sidebar navigation - This would be handled by AppSidebar on mobile */}
              <div className="hidden md:block border-r bg-card h-full">
                <div className="p-4 space-y-4">
                  <Button 
                    className="w-full justify-start gap-2" 
                    variant="default"
                    onClick={handleSyncEmails}
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-4 w-4" />
                    )}
                    {isSyncing ? 'Syncing...' : 'Sync Emails'}
                  </Button>
                  
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search emails..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <nav className="space-y-1">
                    <Button 
                      variant={activeTab === 'inbox' ? 'secondary' : 'ghost'} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab('inbox')}
                    >
                      <Inbox className="mr-2 h-4 w-4" />
                      Inbox
                      <Badge className="ml-auto" variant="outline">
                        {emails.filter(email => !email.isRead).length}
                      </Badge>
                    </Button>
                    <Button 
                      variant={activeTab === 'starred' ? 'secondary' : 'ghost'} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab('starred')}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Starred
                      <Badge className="ml-auto" variant="outline">
                        {emails.filter(email => email.isStarred).length}
                      </Badge>
                    </Button>
                    <Button 
                      variant={activeTab === 'sent' ? 'secondary' : 'ghost'} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab('sent')}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Sent
                    </Button>
                    <Button 
                      variant={activeTab === 'archived' ? 'secondary' : 'ghost'} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab('archived')}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archived
                    </Button>
                    <Button 
                      variant={activeTab === 'trash' ? 'secondary' : 'ghost'} 
                      className="w-full justify-start" 
                      onClick={() => setActiveTab('trash')}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Trash
                    </Button>
                  </nav>
                </div>
              </div>
              
              {/* Email list and content area */}
              <div className="flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold capitalize">
                    {activeTab}
                  </h2>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  {isLoadingEmails ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : isEmailsError ? (
                    <div className="text-center py-10 text-destructive">
                      Error loading emails: {emailsError instanceof Error ? emailsError.message : 'Unknown error'}
                    </div>
                  ) : filteredEmails.length > 0 ? (
                    <div className="space-y-2">
                      {filteredEmails.map((email) => (
                        <div 
                          key={email.id} 
                          onClick={() => handleEmailSelect(email.id)}
                          className="cursor-pointer"
                        >
                          <EmailCard 
                            email={email}
                            onStarToggle={(e) => handleToggleStar(email.id, !email.isStarred, e)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      {searchQuery ? 'No emails matching your search' : 'No emails in this category'}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
