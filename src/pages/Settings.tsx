
import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, RefreshCw, Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="mailboxes">Mailboxes</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      <Github className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" defaultValue="john.doe@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="UTC">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC (Universal Time Coordinated)</SelectItem>
                      <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                      <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mailboxes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Accounts</CardTitle>
                <CardDescription>
                  Add and manage your connected email accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border border-border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Work Gmail</div>
                        <div className="text-sm text-muted-foreground">john.doe@gmail.com</div>
                        <div className="text-xs mt-1 text-muted-foreground">Last synced: 10 minutes ago</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" title="Sync now">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Remove account">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">Personal Outlook</div>
                        <div className="text-sm text-muted-foreground">john.personal@outlook.com</div>
                        <div className="text-xs mt-1 text-muted-foreground">Last synced: 25 minutes ago</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" title="Sync now">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Remove account">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Add New Email Account</span>
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sync Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Auto Sync</div>
                        <div className="text-sm text-muted-foreground">
                          Automatically sync emails at regular intervals
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="syncInterval">Sync Interval</Label>
                      <Select defaultValue="15">
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">Every 5 minutes</SelectItem>
                          <SelectItem value="15">Every 15 minutes</SelectItem>
                          <SelectItem value="30">Every 30 minutes</SelectItem>
                          <SelectItem value="60">Every hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Processing Rules</CardTitle>
                <CardDescription>
                  Define custom AI rules for email processing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="globalRules">Global Processing Rules</Label>
                  <Textarea 
                    id="globalRules" 
                    placeholder="Enter your processing rules in natural language..." 
                    className="min-h-40"
                    defaultValue={`1. Star emails from my boss (boss@company.com) or that contain "urgent" in the subject.
2. For emails about meeting requests, if I'm busy during the proposed time, send an automatic response suggesting alternative times.
3. Add "Work" label to emails from domains ending with my company's domain.
4. Forward emails from newsletter@updates.com to my personal email.`}
                  />
                  <p className="text-sm text-muted-foreground">
                    Write rules in plain language. The AI will interpret and apply them to your emails.
                  </p>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Rule Examples</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-secondary/50 rounded-md">
                      <div className="font-medium">Star important emails</div>
                      <div className="text-muted-foreground mt-1">
                        "Star emails containing words like 'urgent', 'important', or 'deadline'"
                      </div>
                    </div>
                    
                    <div className="p-3 bg-secondary/50 rounded-md">
                      <div className="font-medium">Auto-categorize</div>
                      <div className="text-muted-foreground mt-1">
                        "Add 'Finance' label to emails from my bank or containing words like 'invoice', 'payment', or 'statement'"
                      </div>
                    </div>
                    
                    <div className="p-3 bg-secondary/50 rounded-md">
                      <div className="font-medium">Smart replies</div>
                      <div className="text-muted-foreground mt-1">
                        "For emails asking about my availability, check my calendar and suggest free times"
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button type="submit">Save Rules</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications about important events via email
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-medium">Browser Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Receive browser notifications for new emails
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Change Password</Label>
                    <Input id="password" type="password" placeholder="Current password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Input type="password" placeholder="New password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  
                  <Button>Update Password</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connected Accounts</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Github className="h-5 w-5" />
                      <div>
                        <div className="font-medium">GitHub</div>
                        <div className="text-sm text-muted-foreground">Connected</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
