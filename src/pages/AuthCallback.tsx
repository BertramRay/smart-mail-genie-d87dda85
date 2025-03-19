import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // 从URL中提取token参数
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get('token');

      if (!token) {
        setError('授权失败：未收到有效的令牌');
        toast({
          variant: 'destructive',
          title: '登录失败',
          description: '未能从GitHub获取授权信息',
        });
        
        // 3秒后重定向到登录页
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

      try {
        // 保存令牌到localStorage
        localStorage.setItem('token', token);
        
        // 尝试获取用户信息
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('无法获取用户信息');
        }
        
        const data = await response.json();
        
        if (data.success && data.user) {
          const user = data.user;
          // 保存用户信息到localStorage
          localStorage.setItem('user', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatar
          }));
          
          toast({
            title: 'GitHub登录成功',
            description: '欢迎回来！',
          });
          
          // 重定向到仪表板
          navigate('/dashboard');
        } else {
          throw new Error(data.message || '用户验证失败');
        }
      } catch (error) {
        console.error('回调处理错误:', error);
        setError(error instanceof Error ? error.message : '授权处理失败');
        
        toast({
          variant: 'destructive',
          title: '登录失败',
          description: '无法完成GitHub授权登录',
        });
        
        // 3秒后重定向到登录页
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };
    
    handleCallback();
  }, [location, navigate, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {error ? (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-destructive">授权失败</h2>
          <p className="text-muted-foreground">{error}</p>
          <p>正在重定向到登录页面...</p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <h2 className="text-2xl font-bold">正在完成授权...</h2>
          <p className="text-muted-foreground">请稍候，我们正在验证您的GitHub登录信息</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback; 