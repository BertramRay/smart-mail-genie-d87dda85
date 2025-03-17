
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Mail, Plus } from 'lucide-react';

interface Mailbox {
  id: number;
  name: string;
  provider: string;
}

interface MailboxDropdownProps {
  mailboxes: Mailbox[];
}

export const MailboxDropdown: React.FC<MailboxDropdownProps> = ({ mailboxes }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 font-medium">
          <span className="truncate">All Mailboxes</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Switch Mailbox</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="font-medium">
          All Mailboxes
        </DropdownMenuItem>
        {mailboxes.map((mailbox) => (
          <DropdownMenuItem key={mailbox.id}>
            {mailbox.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="h-4 w-4 mr-2" />
          <span>Add New Mailbox</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
