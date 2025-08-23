import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function SignInForm({ onSubmit, isLoading, onForgot }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ email, password });
            }}
            className="space-y-4 w-full"
        >   
            <div>
                <h1 className="text-2xl font-bold text-center">Welcome back</h1>
                <p className="text-center m-2 text-slate-700">Sign in to your account</p>
            </div>
            <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="flex justify-end">
                <Button type="button" variant="link" className="text-sm p-0" onClick={onForgot}>
                    Forgot password?
                </Button>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
            </Button>
        </form>
    );
}
