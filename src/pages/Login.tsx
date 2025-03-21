import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Github, Mail, Loader2, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, loginWithGitHub, isLoading: authLoading } = useAuth();
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  // 检测GitHub登录是否正在加载
  useEffect(() => {
    // 如果用户点击了GitHub登录按钮但后端处理时间超过10秒，显示友好提示
    let timeoutId: NodeJS.Timeout;
    
    if (isGitHubLoading) {
      timeoutId = setTimeout(() => {
        toast({
          title: '登录时间较长',
          description: 'GitHub登录过程可能需要一些时间，请耐心等待',
        });
      }, 10000);
    }
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isGitHubLoading, toast]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      
      toast({
        title: '登录成功!',
        description: '正在跳转到您的仪表盘...',
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      // 错误已在AuthContext中处理
    }
  };

  const handleGitHubLogin = async () => {
    try {
      setIsGitHubLoading(true);
      await loginWithGitHub();
    } catch (error) {
      // 错误已在AuthContext中处理
      setIsGitHubLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      // 模拟用户
      const mockUser = {
        id: 'demo-user-123',
        name: 'Demo User',
        email: 'demo@example.com',
        avatarUrl: 'https://ui-avatars.com/api/?name=Demo+User&background=6366f1&color=fff'
      };
      
      // 存储模拟数据
      localStorage.setItem('token', 'demo-token-123');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // 刷新页面以应用登录状态
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl">
            <Mail className="w-6 h-6 text-primary" />
            <span>Smart Mail Genie</span>
          </Link>
        </div>
        
        <Card className="border border-border shadow-lg animate-fadeIn">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleGitHubLogin}
              disabled={authLoading || isGitHubLoading}
            >
              {(authLoading || isGitHubLoading) ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Github className="mr-2 h-5 w-5" />
              )}
              {isGitHubLoading ? "正在连接GitHub..." : "Continue with GitHub"}
            </Button>
            
            {import.meta.env.DEV && (
              <Button 
                className="w-full" 
                size="lg"
                variant="secondary"
                onClick={handleDemoLogin}
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                开发模式：直接登录
              </Button>
            )}
            
            <div className="flex items-center">
              <Separator className="flex-1" />
              <span className="mx-4 text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>
            
            {isEmailFormVisible ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="your.email@example.com" 
                            {...field} 
                            disabled={authLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            {...field} 
                            disabled={authLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg" 
                    disabled={authLoading}
                  >
                    {authLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign in
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={() => setIsEmailFormVisible(true)}
                  disabled={authLoading}
                >
                  Sign in with Email
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
