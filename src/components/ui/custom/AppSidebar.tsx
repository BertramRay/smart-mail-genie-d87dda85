
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
  Inbox, 
  Star, 
  Send, 
  Archive, 
  Trash2, 
  Tag, 
  Settings, 
  Mail, 
  Plus, 
  RefreshCcw, 
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MailboxDropdown } from './MailboxDropdown';

export const AppSidebar = () => {
  // Mock data for mailboxes
  const mailboxes = [
    { id: 1, name: "Work Gmail", provider: "gmail" },
    { id: 2, name: "Personal Outlook", provider: "outlook" }
  ];

  const sidebarLinks = [
    { title: "Inbox", icon: Inbox, url: "/app/inbox" },
    { title: "Starred", icon: Star, url: "/app/starred" },
    { title: "Sent", icon: Send, url: "/app/sent" },
    { title: "Archived", icon: Archive, url: "/app/archived" },
    { title: "Trash", icon: Trash2, url: "/app/trash" },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 font-semibold">
            <Mail className="w-5 h-5 text-primary" />
            <span>Smart Mail Genie</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <div className="flex justify-between items-center px-3 py-2">
            <MailboxDropdown mailboxes={mailboxes} />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-foreground/70 hover:text-primary"
              title="Sync emails"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator className="my-2" />
          
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 py-2">
            Labels
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/app/labels/important"
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                      }`
                    }
                  >
                    <Tag className="h-4 w-4" />
                    <span>Important</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/app/labels/work"
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                      }`
                    }
                  >
                    <Tag className="h-4 w-4" />
                    <span>Work</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/app/labels/personal"
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                      }`
                    }
                  >
                    <Tag className="h-4 w-4" />
                    <span>Personal</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-foreground/70 hover:text-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Add Label</span>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2">
          <NavLink 
            to="/app/settings"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-foreground/70 hover:bg-accent hover:text-foreground'
              }`
            }
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </NavLink>
          
          <Button variant="ghost" className="justify-start text-foreground/70 hover:text-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            <span>Log out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
