
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define email type
export interface Email {
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
  preview: string;
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
}

interface EmailAccount {
  id: number;
  name: string;
  email: string;
  provider: string;
  lastSync: string;
}

// Mock data for development
const mockEmails: Email[] = [
  {
    id: '1',
    sender: {
      name: 'Jane Cooper',
      email: 'jane.cooper@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    recipients: ['you@example.com'],
    subject: 'Weekly Team Meeting Notes',
    preview: 'Hi team, I've attached the notes from our meeting yesterday. Please review them and let me know if you have any questions or suggestions for next week's agenda.',
    body: `Hi team,

I've attached the notes from our meeting yesterday. Please review them and let me know if you have any questions or suggestions for next week's agenda.

Key points we discussed:
- Q3 goals and progress
- New product features
- Customer feedback implementation
- Upcoming marketing campaigns

We need to finalize the roadmap by Friday, so please add your comments to the shared document.

Best regards,
Jane`,
    date: new Date('2023-06-30T10:30:00'),
    isRead: false,
    isStarred: true,
    labels: ['Work', 'Important'],
    aiSummary: 'Meeting notes from yesterday, needs your review for next week\'s agenda. Roadmap needs to be finalized by Friday.',
    aiActions: [
      {
        type: 'reply',
        suggestion: 'Thanks for the notes, I'll review them and add my comments to the document by tomorrow.',
        confidence: 0.92
      },
      {
        type: 'tag',
        suggestion: 'Meeting',
        confidence: 0.85
      }
    ]
  },
  {
    id: '2',
    sender: {
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    recipients: ['you@example.com'],
    cc: ['team@example.com'],
    subject: 'Product Launch Update',
    preview: 'The marketing team has finalized the materials for our new product launch. I need your approval on the press release by EOD today.',
    body: `Hi,

The marketing team has finalized the materials for our new product launch. I need your approval on the press release by EOD today.

You can find all the materials in the shared drive folder. Please pay special attention to the messaging around the new features, as we want to make sure we're accurately representing the capabilities.

Once you approve, we'll schedule the announcement for next Monday.

Best,
Alex`,
    date: new Date('2023-06-29T16:45:00'),
    isRead: true,
    isStarred: false,
    labels: ['Work', 'Urgent'],
    aiSummary: 'Press release needs your approval by end of day today for the product launch announcement scheduled for next Monday.',
    aiActions: [
      {
        type: 'flag',
        suggestion: 'Urgent - Requires action today',
        confidence: 0.95
      }
    ]
  },
  {
    id: '3',
    sender: {
      name: 'Sarah Miller',
      email: 'sarah.miller@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    recipients: ['you@example.com'],
    subject: 'Coffee Next Week?',
    preview: 'Hey there! It's been a while since we caught up. Would you be free for coffee next Tuesday around 3 PM? There's a new café I'd love to check out.',
    body: `Hey there!

It's been a while since we caught up. Would you be free for coffee next Tuesday around 3 PM? There's a new café I'd love to check out called "Brewtiful" on Oak Street.

Let me know if that works for you, or if you'd prefer a different day/time.

Looking forward to catching up!

Sarah`,
    date: new Date('2023-06-28T09:15:00'),
    isRead: true,
    isStarred: true,
    labels: ['Personal'],
    aiSummary: 'Sarah wants to meet for coffee next Tuesday at 3 PM at a new café called "Brewtiful" on Oak Street.',
    aiActions: [
      {
        type: 'reply',
        suggestion: 'Hi Sarah, it\'s great to hear from you! Tuesday at 3 PM works for me. I\'d love to check out the new café. Looking forward to catching up!',
        confidence: 0.89
      },
      {
        type: 'tag',
        suggestion: 'Social',
        confidence: 0.78
      }
    ]
  },
  {
    id: '4',
    sender: {
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    recipients: ['you@example.com'],
    subject: 'Invoice #1234 - Due July 5',
    preview: 'Dear Customer, This is a friendly reminder that invoice #1234 for $2,500 is due on July 5, 2023. Please find the attached invoice for your records.',
    body: `Dear Customer,

This is a friendly reminder that invoice #1234 for $2,500 is due on July 5, 2023.

Please find the attached invoice for your records. Payment can be made via bank transfer or credit card through our client portal.

If you have any questions about this invoice, please don't hesitate to contact our billing department.

Thank you for your business.

Best regards,
Michael Johnson
Finance Department`,
    date: new Date('2023-06-27T14:20:00'),
    isRead: false,
    isStarred: false,
    labels: ['Finance'],
    aiSummary: 'Invoice #1234 for $2,500 is due on July 5, 2023. Payment can be made via bank transfer or credit card.',
    attachments: [
      {
        id: 'att1',
        filename: 'Invoice_1234.pdf',
        size: '156 KB',
        type: 'PDF Document'
      }
    ],
    aiActions: [
      {
        type: 'forward',
        suggestion: 'accounting@yourcompany.com',
        confidence: 0.93
      }
    ]
  },
  {
    id: '5',
    sender: {
      name: 'Tech Newsletter',
      email: 'news@technewsletter.com',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    recipients: ['subscribers@technewsletter.com'],
    bcc: ['you@example.com'],
    subject: 'This Week in Tech: AI Breakthroughs & More',
    preview: 'In this week's roundup: OpenAI announces GPT-5, Apple unveils new MacBook Pro models, and Google's quantum computing milestone.',
    body: `# This Week in Tech

## Top Stories

### OpenAI Announces GPT-5
OpenAI has unveiled GPT-5, the next generation of its large language model, claiming significant improvements in reasoning, multimodal capabilities, and reduced hallucinations.

### Apple's New MacBook Pro Models
Apple has released new MacBook Pro models featuring the M3 Pro and M3 Max chips, promising up to 40% better performance than the previous generation.

### Google's Quantum Computing Milestone
Google researchers claim to have achieved quantum supremacy in a new experiment, completing a calculation in 3 minutes that would take the world's fastest supercomputer 10,000 years.

## Industry News

- Tesla unveils new energy storage solution for homes
- Microsoft acquires AI startup for $500 million
- Amazon expands same-day delivery to more cities

To unsubscribe, click [here](https://example.com/unsubscribe).`,
    htmlBody: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">This Week in Tech</h1>
      
      <h2 style="color: #0066cc;">Top Stories</h2>
      
      <h3 style="color: #333;">OpenAI Announces GPT-5</h3>
      <p>OpenAI has unveiled GPT-5, the next generation of its large language model, claiming significant improvements in reasoning, multimodal capabilities, and reduced hallucinations.</p>
      
      <h3 style="color: #333;">Apple's New MacBook Pro Models</h3>
      <p>Apple has released new MacBook Pro models featuring the M3 Pro and M3 Max chips, promising up to 40% better performance than the previous generation.</p>
      
      <h3 style="color: #333;">Google's Quantum Computing Milestone</h3>
      <p>Google researchers claim to have achieved quantum supremacy in a new experiment, completing a calculation in 3 minutes that would take the world's fastest supercomputer 10,000 years.</p>
      
      <h2 style="color: #0066cc;">Industry News</h2>
      <ul>
        <li>Tesla unveils new energy storage solution for homes</li>
        <li>Microsoft acquires AI startup for $500 million</li>
        <li>Amazon expands same-day delivery to more cities</li>
      </ul>
      
      <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        To unsubscribe, click <a href="https://example.com/unsubscribe">here</a>.
      </div>
    </div>`,
    date: new Date('2023-06-26T08:00:00'),
    isRead: true,
    isStarred: false,
    labels: ['Newsletter'],
    aiSummary: 'Tech news about GPT-5, new MacBook Pro models, and Google's quantum computing milestone. Also includes updates on Tesla, Microsoft, and Amazon.',
    aiActions: [
      {
        type: 'archive',
        suggestion: 'Newsletter content already reviewed',
        confidence: 0.82
      }
    ]
  }
];

const mockEmailAccounts: EmailAccount[] = [
  { id: 1, name: 'Work Gmail', email: 'work@gmail.com', provider: 'gmail', lastSync: '10 minutes ago' },
  { id: 2, name: 'Personal Outlook', email: 'personal@outlook.com', provider: 'outlook', lastSync: '2 hours ago' }
];

// Simulated API functions
const fetchEmails = async (category: string = 'inbox'): Promise<Email[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filter emails based on category
  return mockEmails.filter(email => {
    switch(category) {
      case 'starred':
        return email.isStarred;
      case 'sent':
        return false; // In a real app, we'd have a property to identify sent emails
      case 'archived':
        return false; // Same for archived
      case 'trash':
        return false; // Same for trash
      case 'inbox':
      default:
        return true;
    }
  });
};

const fetchEmailById = async (id: string): Promise<Email | undefined> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockEmails.find(email => email.id === id);
};

const markEmailAsRead = async (id: string): Promise<void> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In a real app, this would update the server
  console.log(`Marking email ${id} as read`);
};

const toggleStarEmail = async (id: string, isStarred: boolean): Promise<void> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // In a real app, this would update the server
  console.log(`${isStarred ? 'Starring' : 'Unstarring'} email ${id}`);
};

const fetchEmailAccounts = async (): Promise<EmailAccount[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockEmailAccounts;
};

const addEmailAccount = async (accountData: Omit<EmailAccount, 'id' | 'lastSync'>): Promise<EmailAccount> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would add the account to the database
  const newAccount: EmailAccount = {
    id: Math.floor(Math.random() * 1000),
    ...accountData,
    lastSync: 'Never'
  };
  
  console.log('Adding email account:', newAccount);
  
  return newAccount;
};

const syncEmails = async (): Promise<void> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // In a real app, this would trigger a sync with the email servers
  console.log('Syncing emails...');
};

// React Query hooks for data fetching
export const useEmails = (category: string = 'inbox') => {
  return useQuery({
    queryKey: ['emails', category],
    queryFn: () => fetchEmails(category),
  });
};

export const useEmail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => fetchEmailById(id as string),
    enabled: !!id,
  });
};

export const useEmailAccounts = () => {
  return useQuery({
    queryKey: ['emailAccounts'],
    queryFn: fetchEmailAccounts,
  });
};

export const useMarkEmailAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: markEmailAsRead,
    onSuccess: (_, id) => {
      // Update the cache to mark the email as read
      queryClient.setQueryData(['emails'], (oldData: Email[] | undefined) => {
        if (!oldData) return [];
        
        return oldData.map(email => 
          email.id === id ? { ...email, isRead: true } : email
        );
      });
      
      // Update the email detail cache
      queryClient.setQueryData(['email', id], (oldData: Email | undefined) => {
        if (!oldData) return undefined;
        return { ...oldData, isRead: true };
      });
    },
  });
};

export const useToggleStarEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isStarred }: { id: string; isStarred: boolean }) => 
      toggleStarEmail(id, isStarred),
    onSuccess: (_, { id, isStarred }) => {
      // Update all email lists that might contain this email
      ['inbox', 'starred', 'sent', 'archived', 'trash'].forEach(category => {
        queryClient.setQueryData(['emails', category], (oldData: Email[] | undefined) => {
          if (!oldData) return [];
          
          return oldData.map(email => 
            email.id === id ? { ...email, isStarred } : email
          );
        });
      });
      
      // Update the email detail cache
      queryClient.setQueryData(['email', id], (oldData: Email | undefined) => {
        if (!oldData) return undefined;
        return { ...oldData, isStarred };
      });
    },
  });
};

export const useAddEmailAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addEmailAccount,
    onSuccess: (newAccount) => {
      queryClient.setQueryData(['emailAccounts'], (oldData: EmailAccount[] | undefined) => {
        if (!oldData) return [newAccount];
        return [...oldData, newAccount];
      });
    },
  });
};

export const useSyncEmails = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: syncEmails,
    onSuccess: () => {
      // Invalidate and refetch all email-related queries
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['emailAccounts'] });
    },
  });
};
