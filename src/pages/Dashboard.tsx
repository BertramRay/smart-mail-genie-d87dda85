
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, RefreshCw, MailPlus, Inbox, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmailCard } from '@/components/ui/custom/EmailCard';

// Mock data for emails
const mockEmails = [
  {
    id: '1',
    sender: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    subject: 'Weekly Project Update',
    preview: 'Hi team, Just wanted to share some updates on the project progress. We have successfully completed the first phase of development and are now moving to the next...',
    date: new Date(2023, 7, 15, 10, 30),
    isRead: false,
    isStarred: true,
    labels: ['Work', 'Important'],
    aiSummary: 'Weekly update on project progress. First phase completed, moving to next phase. No action required.',
  },
  {
    id: '2',
    sender: {
      name: 'GitHub',
      email: 'noreply@github.com',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    subject: 'Pull Request: Feature/add user authentication',
    preview: 'A new pull request has been opened in your repository: "Add user authentication with OAuth"...',
    date: new Date(2023, 7, 15, 9, 45),
    isRead: true,
    isStarred: false,
    labels: ['Code', 'Review Required'],
    aiSummary: 'New pull request for user authentication feature. Code review required.',
  },
  {
    id: '3',
    sender: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    subject: 'Meeting Tomorrow',
    preview: 'Hello! Just a quick reminder about our meeting tomorrow at 2 PM. Please prepare your presentation slides...',
    date: new Date(2023, 7, 14, 16, 20),
    isRead: true,
    isStarred: true,
    labels: ['Meeting'],
    aiSummary: 'Reminder for meeting tomorrow at 2 PM. Prepare presentation slides.',
  },
  {
    id: '4',
    sender: {
      name: 'Amazon',
      email: 'orders@amazon.com',
      avatar: 'https://i.pravatar.cc/150?img=15',
    },
    subject: 'Your Amazon Order #123-4567890-123456',
    preview: 'Hello, Your recent order has been shipped and will arrive on Thursday, August 17. Track your package...',
    date: new Date(2023, 7, 14, 12, 15),
    isRead: false,
    isStarred: false,
    labels: ['Shopping'],
    aiSummary: 'Order confirmation. Package will arrive on Thursday, August 17. Tracking information available.',
  },
  {
    id: '5',
    sender: {
      name: 'Michael Chen',
      email: 'michael.c@example.com',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    subject: 'Feedback on your presentation',
    preview: 'Hi there, I wanted to share some thoughts on your presentation last week. Overall, it was very well done...',
    date: new Date(2023, 7, 13, 15, 30),
    isRead: true,
    isStarred: false,
    labels: ['Feedback'],
    aiSummary: 'Positive feedback on your recent presentation. Includes suggestions for improvement.',
  },
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmails, setFilteredEmails] = useState(mockEmails);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredEmails(mockEmails);
    } else {
      const filtered = mockEmails.filter(email => 
        email.subject.toLowerCase().includes(term.toLowerCase()) || 
        email.preview.toLowerCase().includes(term.toLowerCase()) ||
        email.sender.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredEmails(filtered);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Inbox</h1>
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-sm hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search emails..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" size="icon" title="Refresh">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button title="Compose New Email">
                <MailPlus className="h-4 w-4 mr-2" />
                <span>Compose</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>
              
              <Select defaultValue="date">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="sender">Sender</SelectItem>
                  <SelectItem value="subject">Subject</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="all" className="mt-4">
              {filteredEmails.length > 0 ? (
                filteredEmails.map(email => (
                  <EmailCard key={email.id} email={email} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No emails found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="unread" className="mt-4">
              {filteredEmails.filter(email => !email.isRead).length > 0 ? (
                filteredEmails
                  .filter(email => !email.isRead)
                  .map(email => (
                    <EmailCard key={email.id} email={email} />
                  ))
              ) : (
                <div className="text-center py-12">
                  <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No unread emails</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="starred" className="mt-4">
              {filteredEmails.filter(email => email.isStarred).length > 0 ? (
                filteredEmails
                  .filter(email => email.isStarred)
                  .map(email => (
                    <EmailCard key={email.id} email={email} />
                  ))
              ) : (
                <div className="text-center py-12">
                  <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No starred emails</h3>
                  <p className="text-muted-foreground">Star important emails to find them quickly</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Quick Stats</span>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary p-3 rounded-md">
                    <div className="text-muted-foreground text-sm">Unread</div>
                    <div className="text-2xl font-semibold">2</div>
                  </div>
                  <div className="bg-secondary p-3 rounded-md">
                    <div className="text-muted-foreground text-sm">Total</div>
                    <div className="text-2xl font-semibold">5</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Starred</span>
                    <span>2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">AI Processed</span>
                    <span>5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Sync</span>
                    <span>10 mins ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Email Rules</CardTitle>
              <CardDescription>Custom AI processing rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-border rounded-md p-3">
                  <div className="font-medium">Star Important</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Star emails from my boss or containing "urgent" in the subject
                  </div>
                </div>
                
                <div className="border border-border rounded-md p-3">
                  <div className="font-medium">Auto Reply</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Send automatic replies to meeting requests when I'm busy
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Add New Rule</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
