import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import { validateEmail, validatePassword, sanitizeInput } from '@/utils/validation';
import { rateLimiter, RATE_LIMITS } from '@/utils/rateLimiter';
import { handleSecureError } from '@/utils/errorHandler';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();

    // Check if this is a password reset redirect
    const resetParam = searchParams.get('reset');
    if (resetParam === 'true') {
      setIsPasswordReset(true);
    }
  }, [navigate, searchParams]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Rate limiting check
    if (!rateLimiter.isAllowed('auth_signup', email, RATE_LIMITS.AUTH_ATTEMPTS.maxAttempts, RATE_LIMITS.AUTH_ATTEMPTS.windowMs)) {
      const remainingTime = rateLimiter.getRemainingTime('auth_signup', email);
      toast({
        title: "Too many attempts",
        description: `Please wait ${Math.ceil(remainingTime / 60)} minutes before trying again.`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      toast({
        title: "Invalid email",
        description: emailValidation.error,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid password",
        description: passwordValidation.error,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (fullName.trim().length === 0) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: sanitizeInput(fullName),
          }
        }
      });

      if (error) {
        const secureError = handleSecureError(error, 'Auth.handleSignUp');
        toast({
          title: "Sign up failed",
          description: secureError.userMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error) {
      const secureError = handleSecureError(error, 'Auth.handleSignUp');
      toast({
        title: "Error",
        description: secureError.userMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Rate limiting check
    if (!rateLimiter.isAllowed('auth_signin', email, RATE_LIMITS.AUTH_ATTEMPTS.maxAttempts, RATE_LIMITS.AUTH_ATTEMPTS.windowMs)) {
      const remainingTime = rateLimiter.getRemainingTime('auth_signin', email);
      toast({
        title: "Too many attempts",
        description: `Please wait ${Math.ceil(remainingTime / 60)} minutes before trying again.`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      toast({
        title: "Invalid email",
        description: emailValidation.error,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        const secureError = handleSecureError(error, 'Auth.handleSignIn');
        toast({
          title: "Sign in failed",
          description: secureError.userMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Welcome back!",
        });
        navigate('/');
      }
    } catch (error) {
      const secureError = handleSecureError(error, 'Auth.handleSignIn');
      toast({
        title: "Error",
        description: secureError.userMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast({
        title: "Invalid password",
        description: passwordValidation.error,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        const secureError = handleSecureError(error, 'Auth.handlePasswordReset');
        toast({
          title: "Password update failed",
          description: secureError.userMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your password has been updated.",
        });
        setIsPasswordReset(false);
        navigate('/');
      }
    } catch (error) {
      const secureError = handleSecureError(error, 'Auth.handlePasswordReset');
      toast({
        title: "Error",
        description: secureError.userMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/bfdabed2-e05a-4763-a368-dacd61ff3332.png" 
              alt="Grind Flow Logo" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-2xl font-bold text-slate-800">Grind Flow</h1>
          </div>
        </div>

        <Card className="p-6 border-slate-200">
          {isPasswordReset ? (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">Set New Password</h2>
                <p className="text-slate-600 mt-2">Enter your new password</p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </div>
          ) : (
            <Tabs defaultValue="signin" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
                  <p className="text-slate-600 mt-2">Sign in to your account</p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-blue-600 hover:text-blue-700 p-0"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-800">Create account</h2>
                  <p className="text-slate-600 mt-2">Start your grind journey today</p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </Card>

        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
        />
      </div>
    </div>
  );
};

export default Auth;
