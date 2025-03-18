import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authService, User as ApiUser } from '@/services/apiService';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // 验证token并获取当前用户信息
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.user) {
          const apiUser = response.user;
          const formattedUser: User = {
            id: apiUser.id,
            name: apiUser.name,
            email: apiUser.email,
            avatarUrl: apiUser.avatar
          };
          setUser(formattedUser);
        } else {
          // Token无效，清除本地存储
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Failed to verify authentication:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.success && response.token && response.user) {
        const formattedUser: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          avatarUrl: response.user.avatar
        };
        
        setUser(formattedUser);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(formattedUser));
        
        toast({
          title: '登录成功',
          description: '欢迎回来！',
        });
      } else {
        throw new Error(response.message || '登录失败');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: '登录失败',
        description: error instanceof Error ? error.message : '登录失败，请重试。',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const loginWithGitHub = async () => {
    setIsLoading(true);
    try {
      // 构建完整的GitHub OAuth URL，确保它指向代理后的正确路径
      const apiBaseURL = import.meta.env.VITE_API_URL || '/api';
      const githubAuthURL = `${apiBaseURL}/auth/github`;
      
      console.log('Redirecting to GitHub OAuth:', githubAuthURL);
      window.location.href = githubAuthURL;
      
      // 注意：这个函数下面的代码不会立即执行，因为用户被重定向了
      // 用户会从GitHub重定向回来，带着授权码，后端处理后会将用户重定向到前端并带上token
    } catch (error) {
      console.error('GitHub login error:', error);
      toast({
        variant: 'destructive',
        title: 'GitHub登录失败',
        description: error instanceof Error ? error.message : '无法使用GitHub登录，请重试。',
      });
      setIsLoading(false);
    }
  };
  
  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const response = await authService.register(fullName, email, password);
      
      if (response.success && response.token && response.user) {
        const formattedUser: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          avatarUrl: response.user.avatar
        };
        
        setUser(formattedUser);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(formattedUser));
        
        toast({
          title: '注册成功',
          description: '欢迎加入Smart Mail Genie！',
        });
      } else {
        throw new Error(response.message || '注册失败');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: 'destructive',
        title: '注册失败',
        description: error instanceof Error ? error.message : '无法完成注册，请重试。',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast({
      title: '已退出登录',
    });
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGitHub,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
