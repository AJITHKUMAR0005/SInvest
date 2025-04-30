
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedTransition from '@/components/AnimatedTransition';
import { cn } from '@/lib/utils';

const Auth = () => {
  const { user, isLoading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authTab, setAuthTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = () => {
    const newErrors = {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (authTab === 'register' && !username) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (authTab === 'register' && username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (authTab === 'register' && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (authTab === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, username);
        setAuthTab('login');
        // Clear form fields after successful registration
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
        <Card className="w-full max-w-md shadow-lg border-primary/10">
          <CardHeader className="space-y-1 text-center pb-4">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-md">
                <span className="font-bold text-xl text-white">SI</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              SmartInvest
            </CardTitle>
            <CardDescription className="text-muted-foreground/90">
              {authTab === 'login'
                ? 'Sign in to your account to continue'
                : 'Create an account to get started'}
            </CardDescription>
          </CardHeader>

          <Tabs value={authTab} onValueChange={setAuthTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="register" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
                  Register
                </TabsTrigger>
              </TabsList>
            </div>

            <form onSubmit={handleAuth}>
              <CardContent className="space-y-4 pt-2">
                <TabsContent value="register" className="space-y-4 mt-0 p-0">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="username"
                        placeholder="johndoe"
                        className={cn(
                          "pl-10 transition-all border",
                          errors.username ? "border-destructive" : "focus:border-primary"
                        )}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    {errors.username && <p className="text-sm text-destructive mt-1">{errors.username}</p>}
                  </div>
                </TabsContent>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className={cn(
                        "pl-10 transition-all border",
                        errors.email ? "border-destructive" : "focus:border-primary"
                      )}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    {authTab === 'login' && (
                      <a href="#" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={cn(
                        "pl-10 pr-10 transition-all border",
                        errors.password ? "border-destructive" : "focus:border-primary"
                      )}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
                </div>

                <TabsContent value="register" className="space-y-2 mt-0 p-0">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      className={cn(
                        "pl-10 transition-all border",
                        errors.confirmPassword ? "border-destructive" : "focus:border-primary"
                      )}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>
                  )}
                </TabsContent>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-medium shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="h-5 w-5 mr-2 rounded-full border-2 border-t-transparent animate-spin"></div>
                      Processing...
                    </div>
                  ) : authTab === 'login' ? 'Sign In' : 'Create Account'}
                </Button>

                {authTab === 'login' ? (
                  <p className="text-sm text-center text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => setAuthTab('register')}
                    >
                      Register
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => setAuthTab('login')}
                    >
                      Login
                    </button>
                  </p>
                )}
              </CardFooter>
            </form>
          </Tabs>
        </Card>
      </div>
    </AnimatedTransition>
  );
};

export default Auth;
