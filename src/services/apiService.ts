import api from '@/lib/axios';

// 用户相关接口
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// 认证服务
export const authService = {
  // 用户注册
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password
    });
    return response.data;
  },

  // 用户登录
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password
    });
    return response.data;
  },

  // 获取当前用户信息
  async getCurrentUser(): Promise<{success: boolean; user: User}> {
    const response = await api.get<{success: boolean; user: User}>('/auth/me');
    return response.data;
  }
};

// 用户资料服务
export const profileService = {
  // 获取用户资料
  async getProfile(): Promise<{success: boolean; user: User}> {
    const response = await api.get<{success: boolean; user: User}>('/users/profile');
    return response.data;
  },

  // 更新用户资料
  async updateProfile(profileData: Partial<User>): Promise<{success: boolean; user: User}> {
    const response = await api.put<{success: boolean; user: User}>('/users/profile', profileData);
    return response.data;
  }
};

// 规则服务
export interface Rule {
  id: string;
  content: string;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ruleService = {
  // 获取规则
  async getRules(): Promise<{success: boolean; rule: Rule}> {
    const response = await api.get<{success: boolean; rule: Rule}>('/rules');
    return response.data;
  },

  // 创建规则
  async createRule(content: string): Promise<{success: boolean; rule: Rule}> {
    const response = await api.post<{success: boolean; rule: Rule}>('/rules', { content });
    return response.data;
  }
};

// 邮箱服务
export interface Mailbox {
  id: string;
  name: string;
  email: string;
  provider: string;
  syncStatus?: {
    lastSync?: string;
    status: string;
    error?: string;
  };
}

export const mailboxService = {
  // 获取所有邮箱
  async getMailboxes(): Promise<{success: boolean; mailboxes: Mailbox[]}> {
    const response = await api.get<{success: boolean; mailboxes: Mailbox[]}>('/mailboxes');
    return response.data;
  },

  // 添加邮箱
  async addMailbox(mailboxData: {
    name: string;
    email: string;
    provider: string;
    password: string;
    imapHost?: string;
    imapPort?: number;
    smtpHost?: string;
    smtpPort?: number;
  }): Promise<{success: boolean; mailbox: Mailbox}> {
    const response = await api.post<{success: boolean; mailbox: Mailbox}>('/mailboxes', mailboxData);
    return response.data;
  }
};

// 邮件服务
export interface Email {
  id: string;
  mailbox: string;
  subject: string;
  from: {
    name?: string;
    address: string;
  };
  to: {
    name?: string;
    address: string;
  }[];
  cc?: {
    name?: string;
    address: string;
  }[];
  bcc?: {
    name?: string;
    address: string;
  }[];
  html?: string;
  text?: string;
  attachments?: {
    filename: string;
    contentType: string;
    size: number;
    url?: string;
  }[];
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  receivedDate: string;
}

export const emailService = {
  // 获取邮件列表
  async getEmails(mailboxId?: string): Promise<{success: boolean; emails: Email[]}> {
    const url = mailboxId ? `/emails?mailbox=${mailboxId}` : '/emails';
    const response = await api.get<{success: boolean; emails: Email[]}>(url);
    return response.data;
  },

  // 获取单个邮件
  async getEmail(emailId: string): Promise<{success: boolean; email: Email}> {
    const response = await api.get<{success: boolean; email: Email}>(`/emails/${emailId}`);
    return response.data;
  },

  // 标记邮件已读状态
  async markEmailReadStatus(emailId: string, isRead: boolean): Promise<{success: boolean}> {
    const response = await api.put<{success: boolean}>(`/emails/${emailId}/read`, { isRead });
    return response.data;
  },

  // 标记邮件星标状态
  async toggleStarEmail(emailId: string, isStarred: boolean): Promise<{success: boolean}> {
    const response = await api.put<{success: boolean}>(`/emails/${emailId}/star`, { isStarred });
    return response.data;
  },

  // 分析邮件
  async analyzeEmail(emailId: string): Promise<{success: boolean; analysis: any}> {
    const response = await api.post<{success: boolean; analysis: any}>(`/emails/${emailId}/analyze`);
    return response.data;
  }
}; 