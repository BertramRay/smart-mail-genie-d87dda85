
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Email type definitions
export interface Email {
  id: string;
  subject: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  preview: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  labels: string[];
  attachments: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
}

// Mock data for emails
const mockEmails: Email[] = [
  {
    id: "1",
    subject: "Weekly Team Update",
    sender: {
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    preview: "Here's a summary of what our team accomplished this week and plans for next week.",
    body: `
      <p>Hi Team,</p>
      <p>I hope this email finds you well. Here's a summary of our team's accomplishments this week:</p>
      <ul>
        <li>Completed the user authentication module</li>
        <li>Fixed 12 bugs in the dashboard component</li>
        <li>Improved loading time by 30%</li>
      </ul>
      <p>Next week, we'll focus on:</p>
      <ul>
        <li>Implementing the notification system</li>
        <li>Starting work on the analytics dashboard</li>
        <li>Code review for the new features</li>
      </ul>
      <p>Please let me know if you have any questions or concerns.</p>
      <p>Best regards,<br>Alex</p>
    `,
    timestamp: "2023-10-24T09:30:00Z",
    isRead: false,
    isStarred: false,
    labels: ["work", "important"],
    attachments: []
  },
  {
    id: "2",
    subject: "Project Proposal: E-commerce Redesign",
    sender: {
      name: "Maria Garcia",
      email: "maria@example.com",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    preview: "Attached is the proposal for the e-commerce website redesign project we discussed.",
    body: `
      <p>Dear Team,</p>
      <p>I'm excited to share the proposal for our e-commerce website redesign project.</p>
      <p>The proposal includes:</p>
      <ul>
        <li>Project scope and objectives</li>
        <li>Timeline and milestones</li>
        <li>Budget breakdown</li>
        <li>Team allocation</li>
      </ul>
      <p>Please review the attached document and provide your feedback by Friday.</p>
      <p>Thank you,<br>Maria</p>
    `,
    timestamp: "2023-10-23T15:45:00Z",
    isRead: true,
    isStarred: true,
    labels: ["work", "project"],
    attachments: [
      {
        name: "E-commerce_Redesign_Proposal.pdf",
        type: "application/pdf",
        size: 2400000,
        url: "#"
      }
    ]
  },
  {
    id: "3",
    subject: "Invitation: Annual Developer Conference",
    sender: {
      name: "Dev Community",
      email: "events@devcom.org",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    preview: "You're invited to attend our annual developer conference on November 15-17, 2023.",
    body: `
      <p>Hello Developer,</p>
      <p>We're thrilled to invite you to the Annual Developer Conference 2023!</p>
      <p><strong>Date:</strong> November 15-17, 2023</p>
      <p><strong>Location:</strong> Tech Convention Center, San Francisco</p>
      <p>This year's highlights include:</p>
      <ul>
        <li>Keynote speeches from industry leaders</li>
        <li>Workshops on the latest technologies</li>
        <li>Networking opportunities with peers</li>
        <li>Hackathon with amazing prizes</li>
      </ul>
      <p>Register before October 31 to get the early bird discount!</p>
      <p>Looking forward to seeing you there,<br>The Dev Community Team</p>
    `,
    timestamp: "2023-10-22T11:20:00Z",
    isRead: false,
    isStarred: false,
    labels: ["event"],
    attachments: [
      {
        name: "Conference_Schedule.pdf",
        type: "application/pdf",
        size: 1800000,
        url: "#"
      },
      {
        name: "Venue_Map.jpg",
        type: "image/jpeg",
        size: 900000,
        url: "#"
      }
    ]
  },
  {
    id: "4",
    subject: "Your Monthly Subscription",
    sender: {
      name: "Premium Services",
      email: "billing@premiumservices.com",
      avatar: "https://i.pravatar.cc/150?img=4"
    },
    preview: "Your subscription has been renewed successfully. Here's your receipt.",
    body: `
      <p>Dear Valued Customer,</p>
      <p>Thank you for your continued subscription to Premium Services.</p>
      <p>Your monthly subscription has been renewed successfully, and you will continue to enjoy all premium features until the next billing cycle.</p>
      <p><strong>Subscription details:</strong></p>
      <ul>
        <li>Plan: Premium Pro</li>
        <li>Amount: $29.99</li>
        <li>Billing date: October 20, 2023</li>
        <li>Next billing date: November 20, 2023</li>
      </ul>
      <p>You can find your receipt attached to this email.</p>
      <p>If you have any questions or need assistance, please contact our support team.</p>
      <p>Best regards,<br>The Premium Services Team</p>
    `,
    timestamp: "2023-10-20T08:00:00Z",
    isRead: true,
    isStarred: false,
    labels: ["billing"],
    attachments: [
      {
        name: "October_2023_Receipt.pdf",
        type: "application/pdf",
        size: 500000,
        url: "#"
      }
    ]
  },
  {
    id: "5",
    subject: "Feedback Request: New UI Design",
    sender: {
      name: "Jordan Lee",
      email: "jordan@example.com",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    preview: "I've attached the new UI design mockups for the mobile app. Would love your feedback!",
    body: `
      <p>Hi there,</p>
      <p>I've finished working on the new UI design mockups for our mobile application.</p>
      <p>The new design focuses on:</p>
      <ul>
        <li>Improved user navigation</li>
        <li>Better accessibility features</li>
        <li>Modern, clean aesthetic</li>
        <li>Consistent branding elements</li>
      </ul>
      <p>I've attached the mockups in both Figma and PNG formats. Please review them and share your thoughts by the end of the week if possible.</p>
      <p>Thank you,<br>Jordan</p>
    `,
    timestamp: "2023-10-19T14:15:00Z",
    isRead: false,
    isStarred: true,
    labels: ["work", "design"],
    attachments: [
      {
        name: "Mobile_UI_Mockups.fig",
        type: "application/figma",
        size: 4500000,
        url: "#"
      },
      {
        name: "UI_Preview.png",
        type: "image/png",
        size: 2800000,
        url: "#"
      }
    ]
  }
];

// Mock API functions that would be replaced with real API calls in a production app

// Get emails based on category (inbox, starred, etc.)
const fetchEmails = async (category: string): Promise<Email[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Filter emails based on category
  return mockEmails.filter(email => {
    switch(category) {
      case "starred":
        return email.isStarred;
      case "sent":
        return false; // In a real app, we'd have a property to identify sent emails
      case "archived":
        return false; // Same for archived
      case "trash":
        return false; // Same for trash
      case "inbox":
      default:
        return true;
    }
  });
};

// Get a single email by ID
const fetchEmailById = async (id: string): Promise<Email> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const email = mockEmails.find(email => email.id === id);
  
  if (!email) {
    throw new Error(`Email with id ${id} not found`);
  }
  
  return email;
};

// Simulate syncing emails
const syncEmailsApi = async (): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, this would sync with the server
  // For now, just return success
  return true;
};

// Mark an email as read
const markEmailAsReadApi = async (id: string): Promise<Email> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const emailIndex = mockEmails.findIndex(email => email.id === id);
  
  if (emailIndex === -1) {
    throw new Error(`Email with id ${id} not found`);
  }
  
  // Update the email (in a real app, this would be a server call)
  mockEmails[emailIndex] = {
    ...mockEmails[emailIndex],
    isRead: true
  };
  
  return mockEmails[emailIndex];
};

// Toggle email star status
const toggleStarEmailApi = async (id: string, isStarred: boolean): Promise<Email> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const emailIndex = mockEmails.findIndex(email => email.id === id);
  
  if (emailIndex === -1) {
    throw new Error(`Email with id ${id} not found`);
  }
  
  // Update the email (in a real app, this would be a server call)
  mockEmails[emailIndex] = {
    ...mockEmails[emailIndex],
    isStarred
  };
  
  return mockEmails[emailIndex];
};

// React Query hooks

// Hook to fetch emails by category
export const useEmails = (category: string) => {
  return useQuery({
    queryKey: ['emails', category],
    queryFn: () => fetchEmails(category)
  });
};

// Hook to fetch a single email
export const useEmail = (id: string | undefined) => {
  return useQuery({
    queryKey: ['email', id],
    queryFn: () => fetchEmailById(id as string),
    enabled: !!id, // Only run the query if we have an ID
  });
};

// Hook to sync emails
export const useSyncEmails = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: syncEmailsApi,
    onSuccess: () => {
      // Invalidate all email queries to refetch them
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    }
  });
};

// Hook to mark an email as read
export const useMarkEmailAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => markEmailAsReadApi(id),
    onSuccess: (updatedEmail) => {
      // Update the email in the cache
      queryClient.setQueryData(['email', updatedEmail.id], updatedEmail);
      
      // Invalidate the emails list queries
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    }
  });
};

// Hook to toggle star status
export const useToggleStarEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isStarred }: { id: string; isStarred: boolean }) => 
      toggleStarEmailApi(id, isStarred),
    onSuccess: (updatedEmail) => {
      // Update the email in the cache
      queryClient.setQueryData(['email', updatedEmail.id], updatedEmail);
      
      // Invalidate the emails list queries
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    }
  });
};
