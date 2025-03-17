
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { DashboardHeader } from '@/components/ui/custom/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Mail, Key, Save, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('accounts');
  
  // Sample email accounts
  const [emailAccounts, setEmailAccounts] = useState([
    { id: 1, name: 'Work Gmail', email: 'work@gmail.com', provider: 'gmail', lastSync: '10 minutes ago' },
    { id: 2, name: 'Personal Outlook', email: 'personal@outlook.com', provider: 'outlook', lastSync: '2 hours ago' }
  ]);
  
  // Sample processing rules
  const [processingRules, setProcessingRules] = useState(
    `# Email Processing Rules

1. Star all emails from my boss (boss@company.com) and mark them as important.
2. Automatically archive newsletters and promotions.
3. For emails containing "invoice" or "payment", add label "Finance".
4. If an email is from a client and mentions "urgent" or "ASAP", send an auto-reply saying "I've received your urgent message and will respond shortly".
5. Summarize all emails longer than 300 words.
    `
  );
  
  // Form state for adding a new email account
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    password: '',
    server: '',
    port: '',
    provider: 'other'
  });
  
  // Toggle states for automation settings
  const [autoSettings, setAutoSettings] = useState({
    autoSync: true,
    syncInterval: '15',
    autoReply: false,
    processNewEmails: true
  });
  
  const handleAddAccount = () => {
    // In a real app, this would validate and send the data to the backend
    toast({
      title: 'Email Account Added',
      description: `${newAccount.name} (${newAccount.email}) has been configured.`,
    });
    
    // Reset form
    setNewAccount({
      name: '',
      email: '',
      password: '',
      server: '',
      port: '',
      provider: 'other'
    });
  };
  
  const handleSaveRules = () => {
    // In a real app, this would send the updated rules to the backend
    toast({
      title: 'Processing Rules Saved',
      description: 'Your email processing rules have been updated.',
    });
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would send the updated settings to the backend
    toast({
      title: 'Settings Saved',
      description: 'Your automation settings have been updated.',
    });
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        <DashboardHeader />
        
        <div className="flex-1 container max-w-6xl py-6 space-y-8 overflow-auto">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure your email accounts, processing rules, and application preferences.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              <TabsTrigger value="accounts">Email Accounts</TabsTrigger>
              <TabsTrigger value="rules">Processing Rules</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="accounts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Email Accounts</CardTitle>
                  <CardDescription>
                    Manage your connected email accounts for Smart Mail Genie.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emailAccounts.map((account) => (
                    <div 
                      key={account.id} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-muted-foreground">{account.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          Last synced: {account.lastSync}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {account.provider}
                        </Badge>
                        <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add GitHub Account
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Add New Email Account</CardTitle>
                  <CardDescription>
                    Connect a new email account using SMTP and IMAP settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Account Name</Label>
                      <Input 
                        id="account-name"
                        placeholder="e.g., Work Gmail"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-provider">Email Provider</Label>
                      <Select 
                        value={newAccount.provider}
                        onValueChange={(value) => setNewAccount({...newAccount, provider: value})}
                      >
                        <SelectTrigger id="email-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gmail">Gmail</SelectItem>
                          <SelectItem value="outlook">Outlook</SelectItem>
                          <SelectItem value="yahoo">Yahoo</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-address">Email Address</Label>
                    <Input 
                      id="email-address"
                      type="email"
                      placeholder="your.email@example.com"
                      value={newAccount.email}
                      onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-password">Password or App Password</Label>
                    <Input 
                      id="email-password"
                      type="password"
                      placeholder="Enter password or app password"
                      value={newAccount.password}
                      onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      For services with 2FA, use an app password instead of your regular password.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imap-server">IMAP Server</Label>
                      <Input 
                        id="imap-server"
                        placeholder="imap.example.com"
                        value={newAccount.server}
                        onChange={(e) => setNewAccount({...newAccount, server: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="imap-port">IMAP Port</Label>
                      <Input 
                        id="imap-port"
                        placeholder="993"
                        value={newAccount.port}
                        onChange={(e) => setNewAccount({...newAccount, port: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Note</AlertTitle>
                    <AlertDescription>
                      For popular providers like Gmail and Outlook, you typically only need to provide your email and password. We'll auto-configure the server settings.
                    </AlertDescription>
                  </Alert>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAddAccount} className="w-full">
                    <Key className="mr-2 h-4 w-4" />
                    Connect Email Account
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="rules" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Processing Rules</CardTitle>
                  <CardDescription>
                    Define custom rules for how Smart Mail Genie should process your emails.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rules-editor">Processing Rules</Label>
                    <Textarea 
                      id="rules-editor"
                      placeholder="Enter your email processing rules in natural language..."
                      className="font-mono min-h-[300px]"
                      value={processingRules}
                      onChange={(e) => setProcessingRules(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Write your rules in plain language. The AI will interpret them to process your emails.
                    </p>
                  </div>
                  
                  <div className="bg-secondary/50 p-4 rounded-md space-y-2">
                    <h3 className="font-medium">Rule Examples:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Star all emails from person@example.com</li>
                      <li>Add label "Important" to emails containing the word "urgent"</li>
                      <li>Auto-reply to client emails with "Thanks for your message, I'll get back to you soon"</li>
                      <li>Archive all newsletter emails after 2 days</li>
                      <li>Forward emails about invoices to accounting@mycompany.com</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveRules} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Processing Rules
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="automation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Automation Settings</CardTitle>
                  <CardDescription>
                    Configure how frequently and when Smart Mail Genie should process your emails.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Email Synchronization</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically check for new emails at regular intervals
                      </p>
                    </div>
                    <Switch 
                      checked={autoSettings.autoSync}
                      onCheckedChange={(checked) => setAutoSettings({...autoSettings, autoSync: checked})}
                    />
                  </div>
                  
                  {autoSettings.autoSync && (
                    <div className="ml-6 space-y-2">
                      <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                      <Select 
                        value={autoSettings.syncInterval}
                        onValueChange={(value) => setAutoSettings({...autoSettings, syncInterval: value})}
                      >
                        <SelectTrigger id="sync-interval">
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI Processing for New Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Apply AI analysis and rule processing to newly received emails
                      </p>
                    </div>
                    <Switch 
                      checked={autoSettings.processNewEmails}
                      onCheckedChange={(checked) => setAutoSettings({...autoSettings, processNewEmails: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Replies</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow the system to automatically send email replies based on rules
                      </p>
                    </div>
                    <Switch 
                      checked={autoSettings.autoReply}
                      onCheckedChange={(checked) => setAutoSettings({...autoSettings, autoReply: checked})}
                    />
                  </div>
                  
                  {autoSettings.autoReply && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Caution</AlertTitle>
                      <AlertDescription>
                        Automatic replies will be sent based on your processing rules. Make sure your rules are accurate to avoid unwanted emails being sent.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Automation Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
