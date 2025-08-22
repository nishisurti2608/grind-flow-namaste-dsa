import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  validateEmail,
  validatePassword,
  sanitizeInput,
} from "@/utils/validation";
import { rateLimiter, RATE_LIMITS } from "@/utils/rateLimiter";
import { handleSecureError } from "@/utils/errorHandler";

export const useAuth = (toast, navigate) => {
  const signIn = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      if (
        !rateLimiter.isAllowed(
          "auth_signin",
          email,
          RATE_LIMITS.AUTH_ATTEMPTS.maxAttempts,
          RATE_LIMITS.AUTH_ATTEMPTS.windowMs
        )
      ) {
        throw new Error("Too many attempts, please wait");
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) throw new Error(emailValidation.error);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Welcome back!" });
      navigate("/");
    },
    onError: (error) => {
      const secureError = handleSecureError(error, "useAuth.signIn");
      toast({
        title: "Sign in failed",
        description: secureError.userMessage,
        variant: "destructive",
      });
    },
  });

  const signUp = useMutation({
    mutationFn: async ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName: string;
    }) => {
      if (
        !rateLimiter.isAllowed(
          "auth_signup",
          email,
          RATE_LIMITS.AUTH_ATTEMPTS.maxAttempts,
          RATE_LIMITS.AUTH_ATTEMPTS.windowMs
        )
      ) {
        throw new Error("Too many attempts, please wait");
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) throw new Error(emailValidation.error);

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid)
        throw new Error(passwordValidation.error);

      if (!fullName.trim()) throw new Error("Full name required");

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: sanitizeInput(fullName) },
        },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      });
    },
    onError: (error) => {
      const secureError = handleSecureError(error, "useAuth.signUp");
      toast({
        title: "Sign up failed",
        description: secureError.userMessage,
        variant: "destructive",
      });
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid)
        throw new Error(passwordValidation.error);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your password has been updated.",
      });
      navigate("/");
    },
    onError: (error) => {
      const secureError = handleSecureError(error, "useAuth.resetPassword");
      toast({
        title: "Password update failed",
        description: secureError.userMessage,
        variant: "destructive",
      });
    },
  });

  const requestPasswordReset = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) throw new Error(emailValidation.error);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for a link to reset your password.",
      });
    },
    onError: (error) => {
      const secureError = handleSecureError(
        error,
        "useAuth.requestPasswordReset"
      );
      toast({
        title: "Reset failed",
        description: secureError.userMessage,
        variant: "destructive",
      });
    },
  });


  return { signIn, signUp, resetPassword ,requestPasswordReset};
};
