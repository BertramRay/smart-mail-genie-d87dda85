
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { MainLayout } from '@/components/layouts/MainLayout';

const Login = () => {
  return (
    <MainLayout>
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
              <Button className="w-full" size="lg">
                <Github className="mr-2 h-5 w-5" />
                Continue with GitHub
              </Button>
              
              <div className="flex items-center">
                <Separator className="flex-1" />
                <span className="mx-4 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" size="lg" className="w-full">
                  Sign in with Email
                </Button>
              </div>
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
    </MainLayout>
  );
};

export default Login;
