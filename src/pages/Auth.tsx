import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import PasswordResetForm from "@/components/auth/PasswordResetForm";
import SignUpForm from "@/components/auth/SignUpForm";
import SignInForm from "@/components/auth/SiginInForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // pull all mutations from useAuth
  const { signIn, signUp, resetPassword, requestPasswordReset } = useAuth(toast, navigate);

  const isPasswordReset = searchParams.get("reset") === "true";

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-r from-[#eff6ff] to-neutral-100">

      <Button onClick={()=>history.back()} variant="ghost" className="flex gap-4 font-semibold items-center fixed left-4 top-4">
          <ArrowLeft/>
          Back
      </Button>

      <div className="mx-auto max-w-md w-full px-2">
        <div className="flex gap-2 items-center justify-center w-full mb-8">
            <img className="w-8" src="/brand-logo.png" alt="" />
            <h1 className="text-2xl font-bold text-slate-800">Grind Flow</h1>
        </div>
        <Card className="p-6">
          {isPasswordReset ? (
            <PasswordResetForm
              onSubmit={resetPassword.mutate}
              isLoading={resetPassword.isPending}
            />
          ) : (
            <Tabs defaultValue="signin" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <SignInForm
                  onSubmit={signIn.mutate}
                  isLoading={signIn.isPending}
                  onForgot={() => setShowForgotPassword(true)} // ✅ opens modal
                />
              </TabsContent>

              <TabsContent value="signup">
                <SignUpForm
                  onSubmit={signUp.mutate}
                  isLoading={signUp.isPending}
                />
              </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
